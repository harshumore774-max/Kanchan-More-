export interface TemplateFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const TEMPLATE_FILES: TemplateFile[] = [
  {
    name: 'app.py',
    path: 'Nashik-Grape-Connect/app.py',
    language: 'python',
    description: 'Python Flask backend with SQLite database, REST API endpoints, and authentication',
    content: `"""
Nashik Grape Connect - Flask Backend Server
Connects grape farmers, wineries, and fruit exporters with SQLite database.
Run: py app.py
"""

import os
import sqlite3
from flask import Flask, render_template, request, jsonify, redirect, url_for, session, g

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "nashik_grapes_secret_key_2026")
DATABASE = "nashik_grapes.db"

def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, "_database", None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # Users table (Farmers, Wineries, Exporters)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL, -- 'farmer', 'winery', 'exporter'
                phone TEXT,
                taluka TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Grape Listings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS grape_lots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmer_id INTEGER NOT NULL,
                farm_name TEXT NOT NULL,
                variety TEXT NOT NULL,
                category TEXT NOT NULL, -- 'export', 'wine', 'domestic', 'raisin'
                brix REAL NOT NULL,
                acidity REAL,
                berry_size REAL,
                total_tons REAL NOT NULL,
                available_tons REAL NOT NULL,
                price_per_kg REAL NOT NULL,
                taluka TEXT NOT NULL,
                village TEXT NOT NULL,
                certifications TEXT,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (farmer_id) REFERENCES users (id)
            )
        ''')
        
        # Enquiries & Deal Bids
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lot_id INTEGER NOT NULL,
                buyer_id INTEGER NOT NULL,
                requested_tons REAL NOT NULL,
                offered_rate REAL NOT NULL,
                delivery_terms TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lot_id) REFERENCES grape_lots (id),
                FOREIGN KEY (buyer_id) REFERENCES users (id)
            )
        ''')
        
        db.commit()
        seed_data(db)

def seed_data(db):
    cursor = db.cursor()
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        # Seed test accounts
        cursor.execute('''
            INSERT INTO users (name, email, password, role, phone, taluka)
            VALUES 
            ('Sachin Patil', 'sachin@sahyadrifarms.com', 'pass123', 'farmer', '+91 98220 44129', 'Niphad'),
            ('Sula Winery Procurement', 'procure@sulawines.com', 'pass123', 'winery', '+91 99300 45678', 'Dindori'),
            ('EuroFresh Logistics BV', 'buy@eurofresh.nl', 'pass123', 'exporter', '+91 98200 91823', 'Nashik')
        ''')
        
        # Seed initial grape batch
        cursor.execute('''
            INSERT INTO grape_lots (farmer_id, farm_name, variety, category, brix, acidity, berry_size, total_tons, available_tons, price_per_kg, taluka, village, certifications)
            VALUES 
            (1, 'Sahyadri Crest Vineyards', 'Thompson Seedless', 'export', 19.5, 0.62, 19, 30, 25, 86.0, 'Niphad', 'Pimpalgaon Baswant', 'GlobalGAP, APEDA Grazing, Residue Free'),
            (1, 'Sahyadri Valley Red Soil Block', 'Cabernet Sauvignon', 'wine', 23.2, 0.72, 14, 20, 20, 138.0, 'Dindori', 'Vani Road', 'Organic India, Winery Crush Grade')
        ''')
        db.commit()

@app.route('/')
def home():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT g.*, u.name as farmer_name, u.phone as farmer_phone 
        FROM grape_lots g
        JOIN users u ON g.farmer_id = u.id
        ORDER BY g.created_at DESC
    ''')
    lots = cursor.fetchall()
    return render_template('index.html', lots=lots, user=session.get('user'))

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('home'))
    
    user_id = session['user']['id']
    user_role = session['user']['role']
    db = get_db()
    cursor = db.cursor()
    
    if user_role == 'farmer':
        cursor.execute("SELECT * FROM grape_lots WHERE farmer_id = ?", (user_id,))
        my_lots = cursor.fetchall()
        
        cursor.execute('''
            SELECT e.*, g.variety, g.farm_name, u.name as buyer_name, u.phone as buyer_phone
            FROM enquiries e
            JOIN grape_lots g ON e.lot_id = g.id
            JOIN users u ON e.buyer_id = u.id
            WHERE g.farmer_id = ?
            ORDER BY e.created_at DESC
        ''', (user_id,))
        inquiries = cursor.fetchall()
        return render_template('dashboard.html', my_lots=my_lots, inquiries=inquiries, role='farmer')
    else:
        cursor.execute('''
            SELECT e.*, g.variety, g.farm_name, g.price_per_kg as asking_rate, u.name as farmer_name
            FROM enquiries e
            JOIN grape_lots g ON e.lot_id = g.id
            JOIN users u ON g.farmer_id = u.id
            WHERE e.buyer_id = ?
            ORDER BY e.created_at DESC
        ''', (user_id,))
        my_enquiries = cursor.fetchall()
        return render_template('dashboard.html', enquiries=my_enquiries, role=user_role)

@app.route('/api/lots', methods=['GET', 'POST'])
def handle_lots():
    db = get_db()
    cursor = db.cursor()
    if request.method == 'POST':
        if 'user' not in session or session['user']['role'] != 'farmer':
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.json
        cursor.execute('''
            INSERT INTO grape_lots (farmer_id, farm_name, variety, category, brix, acidity, berry_size, total_tons, available_tons, price_per_kg, taluka, village, certifications)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            session['user']['id'],
            data.get('farm_name', 'Nashik Farm'),
            data['variety'],
            data['category'],
            float(data['brix']),
            float(data.get('acidity', 0.65)),
            float(data.get('berry_size', 18)),
            float(data['total_tons']),
            float(data['total_tons']),
            float(data['price_per_kg']),
            data['taluka'],
            data['village'],
            data.get('certifications', '')
        ))
        db.commit()
        return jsonify({'success': True, 'id': cursor.lastrowid})
    else:
        cursor.execute("SELECT * FROM grape_lots WHERE status = 'active'")
        lots = [dict(row) for row in cursor.fetchall()]
        return jsonify(lots)

@app.route('/api/enquiry', methods=['POST'])
def send_enquiry():
    if 'user' not in session:
        return jsonify({'error': 'Please login to send an enquiry'}), 401
    
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO enquiries (lot_id, buyer_id, requested_tons, offered_rate, delivery_terms, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['lot_id'],
        session['user']['id'],
        data['requested_tons'],
        data['offered_rate'],
        data.get('delivery_terms', 'Farm-gate Pickup'),
        data.get('notes', '')
    ))
    db.commit()
    return jsonify({'success': True, 'enquiry_id': cursor.lastrowid})

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    if user:
        session['user'] = dict(user)
        return redirect(url_for('dashboard'))
    return redirect(url_for('home', error='Invalid credentials'))

@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role', 'farmer')
    phone = request.form.get('phone')
    taluka = request.form.get('taluka')
    
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('''
            INSERT INTO users (name, email, password, role, phone, taluka)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (name, email, password, role, phone, taluka))
        db.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (cursor.lastrowid,))
        session['user'] = dict(cursor.fetchone())
        return redirect(url_for('dashboard'))
    except sqlite3.IntegrityError:
        return redirect(url_for('home', error='Email already registered'))

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    init_db()
    print("🍇 Nashik Grape Connect Server running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
`
  },
  {
    name: 'requirements.txt',
    path: 'Nashik-Grape-Connect/requirements.txt',
    language: 'text',
    description: 'Python dependencies for Flask and SQLite server',
    content: `flask>=3.0.0
gunicorn>=21.2.0
requests>=2.31.0
`
  },
  {
    name: 'README.md',
    path: 'Nashik-Grape-Connect/README.md',
    language: 'markdown',
    description: 'Setup and running guide for VS Code and local environment',
    content: `# 🍇 Nashik Grape Connect

India's premier B2B marketplace platform connecting grape growers in Nashik (Niphad, Dindori, Pimpalgaon Baswant) directly with wineries (Sula, York, Grover Zampa) and international fresh fruit export houses.

## 🚀 Quick Start Guide (VS Code)

### 1. Requirements
- Python 3.9 or higher
- VS Code (or any terminal)

### 2. Setup & Installation
Open the extracted directory in VS Code, open the integrated terminal (\`Ctrl + \`\` or \`Terminal -> New Terminal\`), and execute:

\`\`\`bash
# Create and activate virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\\Scripts\\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
py -m pip install -r requirements.txt

# Start the Flask application
py app.py
\`\`\`

### 3. Open in Browser
Visit **http://127.0.0.1:5000/** in your browser.

The SQLite database \`nashik_grapes.db\` is created and seeded automatically on first run with demo accounts:
- **Farmer Login**: \`sachin@sahyadrifarms.com\` / \`pass123\`
- **Winery Login**: \`procure@sulawines.com\` / \`pass123\`
- **Exporter Login**: \`buy@eurofresh.nl\` / \`pass123\`

## 📂 Project Structure

\`\`\`text
Nashik-Grape-Connect/
│
├── app.py                 # Flask server with routes & SQLite schema
├── requirements.txt       # Dependencies (Flask, gunicorn)
├── README.md              # Documentation
│
├── templates/
│   ├── index.html         # Homepage & Grape marketplace
│   └── dashboard.html     # Farmer & Buyer management dashboard
│
└── static/
    ├── style.css          # Modern Tailwind-inspired stylesheet
    ├── script.js          # Marketplace search, filter & modal handlers
    └── dashboard.js       # Batch addition, RFQ bid acceptance
\`\`\`

## 🌿 Key Features
- **Grape Marketplace**: Search by variety (Thompson Seedless, Cabernet Sauvignon, Super Sonaka, Chenin Blanc) and Brix sugar level.
- **Direct RFQ Negotiations**: Exporters & wineries propose metric ton bids and rates.
- **Farmer Batch Postings**: Instant batch listing with Brix, berry size, and GlobalGAP certs.
`
  },
  {
    name: 'templates/index.html',
    path: 'Nashik-Grape-Connect/templates/index.html',
    language: 'html',
    description: 'Jinja2 template for home landing and public grape marketplace',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nashik Grape Connect | B2B Grape Marketplace</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Top Navigation -->
    <header class="top-nav">
        <a href="/" class="brand-logo">🍇 Nashik Grape Connect</a>
        <nav class="nav-links">
            <a href="#marketplace">Marketplace</a>
            <a href="#regions">Vineyard Belts</a>
            <a href="#rates">APMC Mandi Rates</a>
            <a href="#about">About</a>
        </nav>
        <div class="nav-actions">
            {% if user %}
                <a href="/dashboard" class="btn btn-primary">Dashboard ({{ user.role }})</a>
                <a href="/logout" class="btn btn-outline">Logout</a>
            {% else %}
                <button class="btn btn-outline" onclick="openModal('loginModal')">Login</button>
                <button class="btn btn-primary" onclick="openModal('registerModal')">Register</button>
            {% endif %}
        </div>
    </header>

    <!-- Mandi Rate Ticker -->
    <div class="mandi-ticker">
        <span class="ticker-label">LIVE PIMPALGAON APMC:</span>
        <div class="ticker-items">
            <span>Thompson Export: <strong>₹88/kg</strong> (+3.5%)</span>
            <span>Super Sonaka: <strong>₹94/kg</strong> (+1.8%)</span>
            <span>Sharad Black: <strong>₹112/kg</strong> (-0.9%)</span>
            <span>Cabernet Sauvignon: <strong>₹135/kg</strong> (+2.2%)</span>
        </div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-content">
            <p class="hero-tag">India's Wine & Grape Capital</p>
            <h1>Direct Grape Sourcing from Nashik's Finest Vineyards</h1>
            <p class="hero-desc">Connecting 5,000+ viticulturists from Niphad, Dindori & Pimpalgaon directly with commercial wineries and APEDA-certified global fruit exporters.</p>
            <div class="hero-buttons">
                <a href="#marketplace" class="btn btn-primary btn-lg">Explore Available Harvests</a>
                <button class="btn btn-outline btn-lg" onclick="openModal('registerModal')">List Your Harvest Batch</button>
            </div>
        </div>
    </section>

    <!-- Marketplace Filter & Listing Grid -->
    <section id="marketplace" class="marketplace-section">
        <div class="section-header">
            <h2>Active Harvest Batches</h2>
            <p>Browse verified lots with lab-tested Brix sugar levels and pesticide clearance</p>
        </div>

        <div class="filter-bar">
            <input type="text" id="searchInput" placeholder="Search by variety, taluka, or farm name..." onkeyup="filterGrapes()">
            <select id="varietyFilter" onchange="filterGrapes()">
                <option value="all">All Varieties</option>
                <option value="Thompson Seedless">Thompson Seedless</option>
                <option value="Cabernet Sauvignon">Cabernet Sauvignon</option>
                <option value="Super Sonaka">Super Sonaka</option>
                <option value="Chenin Blanc">Chenin Blanc</option>
            </select>
            <select id="categoryFilter" onchange="filterGrapes()">
                <option value="all">All Purposes</option>
                <option value="export">Export Grade (APEDA)</option>
                <option value="wine">Winery Crush (Brix 21°+)</option>
                <option value="domestic">Domestic Table</option>
            </select>
        </div>

        <div class="grape-grid" id="grapeGrid">
            {% for lot in lots %}
            <div class="grape-card" data-variety="{{ lot.variety }}" data-category="{{ lot.category }}">
                <div class="card-header">
                    <span class="badge">{{ lot.category|upper }}</span>
                    <span class="location">{{ lot.village }}, {{ lot.taluka }}</span>
                </div>
                <h3>{{ lot.variety }}</h3>
                <p class="farm-name">by {{ lot.farmer_name }} ({{ lot.farm_name }})</p>
                
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Sugar Brix</span>
                        <span class="spec-val">{{ lot.brix }}° Bx</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Available</span>
                        <span class="spec-val">{{ lot.available_tons }} MT</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Rate / kg</span>
                        <span class="spec-val price">₹{{ lot.price_per_kg }}</span>
                    </div>
                </div>

                <div class="certs">
                    <small>Certs: {{ lot.certifications }}</small>
                </div>

                <div class="card-actions">
                    <button class="btn btn-primary btn-block" onclick="sendEnquiryModal('{{ lot.id }}', '{{ lot.variety }}', '{{ lot.price_per_kg }}')">Send RFQ Proposal</button>
                </div>
            </div>
            {% endfor %}
        </div>
    </section>

    <!-- Modals for Login, Register, RFQ -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('loginModal')">&times;</span>
            <h3>Login to Nashik Grape Connect</h3>
            <form action="/login" method="POST">
                <input type="email" name="email" placeholder="Email Address" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit" class="btn btn-primary btn-block">Sign In</button>
            </form>
            <p class="demo-tip">Demo Accounts: sachin@sahyadrifarms.com (Farmer) or procure@sulawines.com (Winery)</p>
        </div>
    </div>

    <div id="registerModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('registerModal')">&times;</span>
            <h3>Create an Account</h3>
            <form action="/register" method="POST">
                <input type="text" name="name" placeholder="Full Name / Farm / Company Name" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <input type="text" name="phone" placeholder="Contact Mobile (+91)">
                <select name="role">
                    <option value="farmer">Grape Farmer / Viticulturist</option>
                    <option value="winery">Commercial Winery / Winemaker</option>
                    <option value="exporter">Fruit Exporter / Packing House</option>
                </select>
                <select name="taluka">
                    <option value="Niphad">Niphad</option>
                    <option value="Dindori">Dindori</option>
                    <option value="Pimpalgaon Baswant">Pimpalgaon Baswant</option>
                    <option value="Chandwad">Chandwad</option>
                    <option value="Satana">Satana</option>
                </select>
                <button type="submit" class="btn btn-primary btn-block">Register Now</button>
            </form>
        </div>
    </div>

    <script src="{{ url_for('static', filename='script.js') }}"></script>
</body>
</html>
`
  },
  {
    name: 'templates/dashboard.html',
    path: 'Nashik-Grape-Connect/templates/dashboard.html',
    language: 'html',
    description: 'Jinja2 template for farmer batch management & buyer RFQ deals',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Nashik Grape Connect</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body class="dashboard-body">
    <header class="top-nav">
        <a href="/" class="brand-logo">🍇 Nashik Grape Connect</a>
        <div class="nav-actions">
            <span>Welcome, <strong>{{ session['user']['name'] }}</strong> ({{ role|upper }})</span>
            <a href="/" class="btn btn-outline">Back to Market</a>
            <a href="/logout" class="btn btn-primary">Logout</a>
        </div>
    </header>

    <div class="dashboard-container">
        {% if role == 'farmer' %}
        <div class="dashboard-header">
            <div>
                <h2>Farmer Batch Management</h2>
                <p>Post and manage your grape harvest batches for wineries and export houses.</p>
            </div>
            <button class="btn btn-primary" onclick="openModal('addLotModal')">+ Post New Grape Batch</button>
        </div>

        <div class="dashboard-section">
            <h3>Your Listed Grape Batches</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Variety</th>
                        <th>Brix</th>
                        <th>Available (MT)</th>
                        <th>Rate/kg</th>
                        <th>Taluka</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {% for lot in my_lots %}
                    <tr>
                        <td><strong>{{ lot.variety }}</strong></td>
                        <td>{{ lot.brix }}° Bx</td>
                        <td>{{ lot.available_tons }} MT</td>
                        <td>₹{{ lot.price_per_kg }}</td>
                        <td>{{ lot.taluka }}</td>
                        <td><span class="status-badge active">{{ lot.status }}</span></td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>

        <div class="dashboard-section">
            <h3>Incoming Quotation Requests (RFQs)</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Buyer</th>
                        <th>Lot Variety</th>
                        <th>Requested Tons</th>
                        <th>Offered Rate</th>
                        <th>Terms</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {% for inq in inquiries %}
                    <tr>
                        <td>{{ inq.buyer_name }}<br><small>{{ inq.buyer_phone }}</small></td>
                        <td>{{ inq.variety }}</td>
                        <td>{{ inq.requested_tons }} MT</td>
                        <td><strong>₹{{ inq.offered_rate }}/kg</strong></td>
                        <td>{{ inq.delivery_terms }}</td>
                        <td><span class="status-badge {{ inq.status }}">{{ inq.status }}</span></td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
        {% else %}
        <!-- Winery / Exporter Dashboard -->
        <div class="dashboard-header">
            <div>
                <h2>Procurement & Contract Bids</h2>
                <p>Track your proposals sent to Nashik vineyard growers.</p>
            </div>
            <a href="/" class="btn btn-primary">Browse Active Lots</a>
        </div>

        <div class="dashboard-section">
            <h3>Your Submitted Quotations (RFQs)</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Farmer / Vineyard</th>
                        <th>Variety</th>
                        <th>Requested</th>
                        <th>Your Bid Rate</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {% for enq in enquiries %}
                    <tr>
                        <td>{{ enq.farmer_name }} ({{ enq.farm_name }})</td>
                        <td>{{ enq.variety }}</td>
                        <td>{{ enq.requested_tons }} MT</td>
                        <td>₹{{ enq.offered_rate }}/kg</td>
                        <td><span class="status-badge {{ enq.status }}">{{ enq.status }}</span></td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
        {% endif %}
    </div>

    <!-- Modal for adding a new lot -->
    <div id="addLotModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('addLotModal')">&times;</span>
            <h3>Post New Grape Batch</h3>
            <form id="lotForm" onsubmit="submitNewLot(event)">
                <input type="text" id="farm_name" placeholder="Farm / Vineyard Block Name" required>
                <select id="variety">
                    <option value="Thompson Seedless">Thompson Seedless</option>
                    <option value="Cabernet Sauvignon">Cabernet Sauvignon</option>
                    <option value="Super Sonaka">Super Sonaka</option>
                    <option value="Chenin Blanc">Chenin Blanc</option>
                    <option value="Sharad Seedless">Sharad Seedless</option>
                </select>
                <select id="category">
                    <option value="export">Export Grade Table Grapes</option>
                    <option value="wine">Winery Crush Grade</option>
                    <option value="domestic">Domestic Premium Table</option>
                </select>
                <input type="number" step="0.1" id="brix" placeholder="Sugar Brix (°Bx, e.g. 19.5)" required>
                <input type="number" step="0.1" id="total_tons" placeholder="Total Available Quantity (Metric Tons)" required>
                <input type="number" step="0.5" id="price_per_kg" placeholder="Asking Rate per kg (₹)" required>
                <select id="taluka">
                    <option value="Niphad">Niphad</option>
                    <option value="Dindori">Dindori</option>
                    <option value="Pimpalgaon Baswant">Pimpalgaon Baswant</option>
                    <option value="Chandwad">Chandwad</option>
                </select>
                <input type="text" id="village" placeholder="Village / Landmark" required>
                <input type="text" id="certifications" placeholder="Certifications (e.g. GlobalGAP, Residue Free)">
                <button type="submit" class="btn btn-primary btn-block">Publish Harvest Batch</button>
            </form>
        </div>
    </div>

    <script src="{{ url_for('static', filename='dashboard.js') }}"></script>
</body>
</html>
`
  },
  {
    name: 'static/style.css',
    path: 'Nashik-Grape-Connect/static/style.css',
    language: 'css',
    description: 'Clean responsive stylesheet for the Flask templates',
    content: `:root {
    --primary: #1b4d3e;
    --primary-hover: #13382c;
    --accent: #8b1e3f;
    --bg-canvas: #fafaf9;
    --bg-card: #ffffff;
    --border: #e7e5e4;
    --text-main: #1c1917;
    --text-muted: #78716c;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    background-color: var(--bg-canvas);
    color: var(--text-main);
    line-height: 1.5;
}

/* Header */
.top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 1rem 2rem;
    background: #fff;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
}

.brand-logo {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
    text-decoration: none;
    white-space: nowrap;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
}

.nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: color 0.15s;
}

.nav-links a:hover {
    color: var(--primary);
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    white-space: nowrap;
}

/* Buttons */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    transition: all 0.15s;
}

.btn-primary {
    background-color: var(--primary);
    color: white;
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.btn-outline {
    background: transparent;
    border-color: var(--border);
    color: var(--text-main);
}

.btn-outline:hover {
    background: #f5f5f4;
}

.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
}

.btn-block {
    width: 100%;
}

/* Mandi Ticker */
.mandi-ticker {
    background: #1c1917;
    color: #fff;
    padding: 0.4rem 2rem;
    display: flex;
    gap: 1.5rem;
    font-size: 0.8rem;
    overflow-x: auto;
    white-space: nowrap;
}

.ticker-label {
    color: #a8a29e;
    font-weight: 700;
}

.ticker-items {
    display: flex;
    gap: 2rem;
}

/* Hero */
.hero-section {
    padding: 4rem 2rem;
    background: linear-gradient(180deg, #f0fdf4 0%, #fafaf9 100%);
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-tag {
    color: var(--primary);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}

.hero-section h1 {
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: #0f172a;
}

.hero-desc {
    font-size: 1.1rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
}

.hero-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

/* Marketplace */
.marketplace-section {
    max-width: 1200px;
    margin: 3rem auto;
    padding: 0 1.5rem;
}

.section-header {
    margin-bottom: 2rem;
}

.filter-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.filter-bar input, .filter-bar select {
    padding: 0.6rem 1rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.9rem;
    background: #fff;
}

.filter-bar input {
    flex: 1;
}

.grape-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
}

.grape-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.grape-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
}

.specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.5rem;
    background: #f5f5f4;
    padding: 0.75rem;
    border-radius: 6px;
    margin: 1rem 0;
}

.spec-label {
    display: block;
    font-size: 0.7rem;
    color: var(--text-muted);
}

.spec-val {
    font-weight: 700;
    font-size: 0.95rem;
    font-family: 'JetBrains Mono', monospace;
}

.spec-val.price {
    color: var(--primary);
}

/* Modals */
.modal {
    display: none;
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 480px;
    width: 90%;
    position: relative;
}

.modal-content form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

.modal-content input, .modal-content select {
    padding: 0.6rem;
    border: 1px solid var(--border);
    border-radius: 6px;
}

.close {
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    font-size: 1.5rem;
    cursor: pointer;
}

.demo-tip {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 1rem;
    text-align: center;
}
`
  },
  {
    name: 'static/script.js',
    path: 'Nashik-Grape-Connect/static/script.js',
    language: 'javascript',
    description: 'Frontend scripts for client-side search, filtering, and modal management',
    content: `// Modal helper
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Client-side search and filtering
function filterGrapes() {
    const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const varietyVal = document.getElementById('varietyFilter')?.value || 'all';
    const categoryVal = document.getElementById('categoryFilter')?.value || 'all';
    
    const cards = document.querySelectorAll('.grape-card');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const variety = card.getAttribute('data-variety');
        const category = card.getAttribute('data-category');
        
        const matchesSearch = text.includes(searchVal);
        const matchesVariety = varietyVal === 'all' || variety === varietyVal;
        const matchesCategory = categoryVal === 'all' || category === categoryVal;
        
        if (matchesSearch && matchesVariety && matchesCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sendEnquiryModal(lotId, variety, price) {
    alert(\`To submit an RFQ proposal for \${variety} (Asking ₹\${price}/kg), please login as a Winery or Exporter!\`);
    openModal('loginModal');
}
`
  },
  {
    name: 'static/dashboard.js',
    path: 'Nashik-Grape-Connect/static/dashboard.js',
    language: 'javascript',
    description: 'Dashboard batch publication and proposal response API calls',
    content: `async function submitNewLot(e) {
    e.preventDefault();
    const lotData = {
        farm_name: document.getElementById('farm_name').value,
        variety: document.getElementById('variety').value,
        category: document.getElementById('category').value,
        brix: document.getElementById('brix').value,
        total_tons: document.getElementById('total_tons').value,
        price_per_kg: document.getElementById('price_per_kg').value,
        taluka: document.getElementById('taluka').value,
        village: document.getElementById('village').value,
        certifications: document.getElementById('certifications').value,
    };
    
    try {
        const res = await fetch('/api/lots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lotData)
        });
        const json = await res.json();
        if (json.success) {
            alert('🎉 Grape harvest lot listed successfully!');
            window.location.reload();
        } else {
            alert('Error: ' + (json.error || 'Failed to list batch'));
        }
    } catch (err) {
        alert('Network error submitting lot');
    }
}
`
  }
];

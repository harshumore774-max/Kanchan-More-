import React, { useState } from 'react';
import JSZip from 'jszip';
import { TEMPLATE_FILES, TemplateFile } from '../data/templateFiles';
import { Language } from '../types/grape';

interface TemplateDownloaderProps {
  language: Language;
}

export const TemplateDownloader: React.FC<TemplateDownloaderProps> = ({ language }) => {
  const [selectedFile, setSelectedFile] = useState<TemplateFile>(TEMPLATE_FILES[0]);
  const [isZipping, setIsZipping] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('Nashik-Grape-Connect');

      // Add each template file to the zip folder
      TEMPLATE_FILES.forEach((file) => {
        const relativePath = file.path.replace('Nashik-Grape-Connect/', '');
        folder?.file(relativePath, file.content);
      });

      // Generate the zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger browser download
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Nashik-Grape-Connect.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="vscode-template" className="py-14 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {language === 'mr' ? 'स्थानिक विकास व कोड' : 'Ready-to-Run Starter Kit'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {language === 'mr' ? 'नाशिक ग्रेप कनेक्ट — VS Code वेबसाईट टेम्पलेट' : 'Nashik Grape Connect — Website Template'}
            </h2>
            <p className="text-sm text-stone-300 mt-1 max-w-2xl">
              {language === 'mr'
                ? 'Flask बॅकएंड, SQLite डेटाबेस, शेतकरी व खरेदीदार डॅशबोर्डसह संपूर्ण प्रोजेक्ट ZIP डाऊनलोड करा किंवा VS Code मध्ये चालवा.'
                : 'A ready-made project folder with modern frontend, Python Flask backend, SQLite database setup, and user registration pages.'}
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-5 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <span>📦</span>
            <span>{isZipping ? 'Generating ZIP...' : 'Download Complete Website Template (ZIP)'}</span>
          </button>
        </div>

        {/* Quick Instructions Strip */}
        <div className="bg-stone-800/80 rounded-xl border border-stone-700/80 p-5 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
            {language === 'mr' ? 'VS Code मध्ये सुरू करण्याची पद्धत' : 'How to Run in VS Code (Terminal)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-900/90 p-3.5 rounded-lg border border-stone-700">
              <div className="text-stone-400 mb-1">1. Download & Extract</div>
              <div className="font-medium text-stone-200">
                Click the green button above to download the <code className="text-emerald-400">.ZIP</code> and extract it into a folder.
              </div>
            </div>

            <div className="bg-stone-900/90 p-3.5 rounded-lg border border-stone-700">
              <div className="flex items-center justify-between text-stone-400 mb-1">
                <span>2. Install Dependencies</span>
                <button
                  onClick={() => copyToClipboard('py -m pip install -r requirements.txt', 'install')}
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  {copiedKey === 'install' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="block bg-stone-950 p-2 rounded text-emerald-300 font-mono text-[11px] overflow-x-auto">
                py -m pip install -r requirements.txt
              </code>
            </div>

            <div className="bg-stone-900/90 p-3.5 rounded-lg border border-stone-700">
              <div className="flex items-center justify-between text-stone-400 mb-1">
                <span>3. Start Local Server</span>
                <button
                  onClick={() => copyToClipboard('py app.py', 'run')}
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  {copiedKey === 'run' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="block bg-stone-950 p-2 rounded text-emerald-300 font-mono text-[11px] overflow-x-auto">
                py app.py
              </code>
              <div className="text-[10px] text-stone-400 mt-1">Open http://127.0.0.1:5000/</div>
            </div>
          </div>
        </div>

        {/* Code Explorer Interface (Like VS Code Sidebar + Editor) */}
        <div className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Folder Explorer */}
            <div className="w-full md:w-64 bg-stone-900/60 border-r border-stone-800 p-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-3 flex items-center justify-between">
                <span>PROJECT EXPLORER</span>
                <span className="text-[10px] text-stone-500 font-mono">Flask + SQLite</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-emerald-400 px-2 py-1 flex items-center gap-1.5">
                  <span>📁</span>
                  <span>Nashik-Grape-Connect/</span>
                </div>

                <div className="pl-3 space-y-0.5 text-xs font-mono">
                  {TEMPLATE_FILES.map((file) => {
                    const isSelected = selectedFile.name === file.name;
                    return (
                      <button
                        key={file.name}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-emerald-900/40 text-emerald-300 font-semibold border-l-2 border-emerald-500'
                            : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                        }`}
                      >
                        <span className="truncate">{file.name}</span>
                        <span className="text-[10px] text-stone-500">{file.language}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Code View Area */}
            <div className="flex-1 flex flex-col min-h-[460px]">
              <div className="px-5 py-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-stone-200">{selectedFile.path}</span>
                  <span className="text-stone-500 ml-2 hidden sm:inline">({selectedFile.description})</span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedFile.content, 'code')}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs transition-colors flex items-center gap-1"
                >
                  <span>{copiedKey === 'code' ? '✓ Copied' : 'Copy File Content'}</span>
                </button>
              </div>

              <div className="p-4 bg-stone-950 font-mono text-xs text-stone-300 overflow-x-auto flex-1 max-h-[500px]">
                <pre className="whitespace-pre">{selectedFile.content}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

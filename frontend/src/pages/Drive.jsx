import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { logout } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";
import { Upload, LogOut, File, Download, Eye, Trash2, Folder, Search, Menu, X, Loader2, Calendar, HardDrive, User, Share2, Copy, Grid, List, MoreVertical, Image, FileText, Music, Video, Archive } from "lucide-react";

function Drive() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    lastUpload: null
  });

  const fetchFiles = async () => {
    try {
      const res = await api.get("/files/list");
      setFiles(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("File link has been copied to clipboard");
    } catch (err) {
      console.error(err);
      alert("Failed to copy");
    }
  };

  const calculateStats = (fileList) => {
    const totalSize = fileList.reduce((sum, f) => sum + f.size, 0);
    const lastUpload = fileList.length > 0 
      ? new Date(Math.max(...fileList.map(f => new Date(f.createdAt))))
      : null;
    
    setStats({
      totalFiles: fileList.length,
      totalSize: totalSize,
      lastUpload: lastUpload
    });
  };
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);
    window.history.replaceState({}, document.title, "/drive");
  }
  }, []);


  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await api.post("/files/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      document.getElementById("fileInput").value = "";
      fetchFiles();
      alert("✅ File uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      await api.delete(`/files/${fileId}`);
      fetchFiles();
      alert(`"${fileName}" has been deleted.`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete file.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = {
      jpg: <Image className="text-blue-500" size={20} />,
      jpeg: <Image className="text-blue-500" size={20} />,
      png: <Image className="text-blue-500" size={20} />,
      gif: <Image className="text-blue-500" size={20} />,
      pdf: <FileText className="text-red-500" size={20} />,
      doc: <FileText className="text-blue-600" size={20} />,
      docx: <FileText className="text-blue-600" size={20} />,
      txt: <FileText className="text-gray-500" size={20} />,
      mp3: <Music className="text-purple-500" size={20} />,
      wav: <Music className="text-purple-500" size={20} />,
      mp4: <Video className="text-orange-500" size={20} />,
      avi: <Video className="text-orange-500" size={20} />,
      zip: <Archive className="text-yellow-500" size={20} />,
      rar: <Archive className="text-yellow-500" size={20} />,
    };
    return icons[ext] || <File className="text-gray-500" size={20} />;
  };

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar - Professional Google-like */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Mini Drive</h1>
                </div>
              </div>

              {/* Desktop Menu Items */}
              <div className="hidden md:flex items-center space-x-1">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  My Drive
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  Shared
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  Recent
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  Starred
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                  Trash
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search in Drive"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 lg:w-80"
                />
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <Grid size={20} className={viewMode === "grid" ? "text-blue-600" : "text-gray-500"} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <List size={20} className={viewMode === "list" ? "text-blue-600" : "text-gray-500"} />
                </button>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  U
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden py-4`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search in Drive"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Drive</h2>
              <p className="text-gray-600 mt-1">
                {stats.totalFiles} files • {formatFileSize(stats.totalSize)} used
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <Upload size={18} />
                  <span className="font-medium">New</span>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Storage Progress */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Storage</span>
              <span className="text-sm text-gray-600">
                {formatFileSize(stats.totalSize)} of 15 GB used
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((stats.totalSize / (15 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {file && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <File className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setFile(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Files Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Files</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <button className={`${viewMode === "grid" ? "text-blue-600" : ""}`} onClick={() => setViewMode("grid")}>
                Grid
              </button>
              <button className={`${viewMode === "list" ? "text-blue-600" : ""}`} onClick={() => setViewMode("list")}>
                List
              </button>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Folder className="text-gray-400" size={28} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No files yet</h3>
              <p className="text-gray-500 mb-4">Upload files to get started</p>
              <label htmlFor="fileInput" className="inline-block cursor-pointer">
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upload Files
                </div>
              </label>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((f) => (
                <div key={f._id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getFileIcon(f.name)}
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </div>
                    <h4 className="font-medium text-gray-800 mt-3 truncate">{f.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{formatFileSize(f.size)}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(f.createdAt)}</p>
                  </div>
                  <div className="border-t border-gray-100 p-2 flex justify-around">
                    <button
                      onClick={() => handleCopy(f.url)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Copy link"
                    >
                      <Copy size={16} className="text-purple-400" />
                    </button>
                    <a
                      href={f.url}
                      download
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Download"
                    >
                      <Download size={16} className="text-green-500" />
                    </a>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Preview"
                    >
                      <Eye size={16} className="text-blue-400" />
                    </a>
                    <button
                      onClick={() => handleFileDelete(f._id, f.name)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">Name</th>
                      <th className="text-left p-4 font-medium text-gray-600">Size</th>
                      <th className="text-left p-4 font-medium text-gray-600">Modified</th>
                      <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredFiles.map((f) => (
                      <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                              {getFileIcon(f.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 truncate">{f.name}</p>
                              <p className="text-sm text-gray-500">
                                {f.name.split('.').pop().toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatFileSize(f.size)}
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatDate(f.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCopy(f.url)}
                              className="p-2 hover:bg-gray-100 rounded"
                              title="Copy link"
                            >
                              <Copy size={16} className="text-purple-400" />
                            </button>
                            <a
                              href={f.url}
                              download
                              className="p-2 hover:bg-gray-100 rounded"
                              title="Download"
                            >
                              <Download size={16} className="text-green-400" />
                            </a>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 rounded"
                              title="Preview"
                            >
                              <Eye size={16} className="text-blue-400" />
                            </a>
                            <button
                              onClick={() => handleFileDelete(f._id, f.name)}
                              className="p-2 hover:bg-gray-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                <Folder className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Files</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalFiles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                <HardDrive className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatFileSize(stats.totalSize)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Upload</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {stats.lastUpload ? formatDate(stats.lastUpload) : 'No files'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Drive;

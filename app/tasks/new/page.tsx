'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AttachmentFile {
  name: string;
  sizeFormatted: string;
  url: string;
  type: string;
}

export default function CreateTaskPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('#00B37E');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  // Category Options State
  const [categoryOptions, setCategoryOptions] = useState([
    { label: 'Delivery App', value: 'delivery-app' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Internal Tools', value: 'internal' },
  ]);

  // Modal / Input State untuk Category Baru
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Dropdown Open States
  const [openDropdown, setOpenDropdown] = useState<'category' | 'status' | 'priority' | null>(null);

  // Sub-task State
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [newSubTaskInput, setNewSubTaskInput] = useState('');

  // Assignees State
  const [assignees, setAssignees] = useState<string[]>(['Alex', 'Sarah']);
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [newAssigneeName, setNewAssigneeName] = useState('');

  // Attachments State
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const colors = ['#00B37E', '#FF5733', '#6C5CE7', '#FFB800', '#3B82F6'];

  const statusOptions = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Review', value: 'review' },
    { label: 'Done', value: 'done' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  // Helper: Format Ukuran File
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Helper: Kompresi Gambar Menggunakan Canvas (Target ≤ 300 KB)
  const compressImage = (file: File, targetSizeKB = 300): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/') || file.size <= targetSizeKB * 1024) {
        resolve(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDimension = 1200;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const attemptCompress = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (blob.size <= targetSizeKB * 1024 || q <= 0.15) {
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else {
                  attemptCompress(q - 0.15);
                }
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            q
          );
        };

        attemptCompress(quality);
      };

      reader.readAsDataURL(file);
    });
  };

  // Handler Unggah & Kompresi Attachment
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);

    const processedFiles: AttachmentFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const originalFile = files[i];
      let finalFile = originalFile;

      if (originalFile.type.startsWith('image/')) {
        finalFile = await compressImage(originalFile, 300);
      }

      const fileUrl = URL.createObjectURL(finalFile);

      processedFiles.push({
        name: finalFile.name,
        sizeFormatted: formatFileSize(finalFile.size),
        url: fileUrl,
        type: finalFile.type,
      });
    }

    setAttachments((prev) => [...prev, ...processedFiles]);
    setIsCompressing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  // Handler Assignee
  const handleAddAssignee = () => {
    if (newAssigneeName.trim() !== '') {
      setAssignees([...assignees, newAssigneeName.trim()]);
      setNewAssigneeName('');
      setIsAssigneeModalOpen(false);
    }
  };

  const handleRemoveAssignee = (nameToRemove: string) => {
    setAssignees(assignees.filter((name) => name !== nameToRemove));
  };

  // Handler Category Baru
  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;

    const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newOption = { label: newCategoryName.trim(), value: slug };

    setCategoryOptions((prev) => [...prev, newOption]);
    setCategory(slug);
    setNewCategoryName('');
    setIsAddingCategory(false);
    setOpenDropdown(null);
  };

  // Handler Hapus Category
  const handleDeleteCategory = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation(); // Mencegah dropdown tertutup atau terpilih saat tombol delete diklik
    
    // Hapus dari opsi categoryOptions
    setCategoryOptions((prev) => prev.filter((opt) => opt.value !== valueToRemove));

    // Jika kategori yang dihapus sedang aktif dipilih, reset state category
    if (category === valueToRemove) {
      setCategory('');
    }
  };

  const handleAddSubTask = () => {
    if (newSubTaskInput.trim() !== '') {
      setSubTasks([...subTasks, newSubTaskInput.trim()]);
      setNewSubTaskInput('');
    }
  };

  const handleRemoveSubTask = (indexToRemove: number) => {
    setSubTasks(subTasks.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskPayload = {
      title,
      category,
      color: selectedColor,
      status,
      priority,
      dueDate,
      description,
      assignees,
      subTasks,
      attachments,
    };

    console.log('Task Successfully Created:', taskPayload);
    router.push('/tasks');
  };

  return (
    <div 
      className="bg-[#f4f4f6] text-slate-900 min-h-screen flex flex-col pb-28 md:pb-8 font-sans"
      onClick={() => setOpenDropdown(null)}
    >
      <form onSubmit={handleSubmit} className="flex flex-col min-h-screen">
        {/* Top Navigation Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 flex justify-between items-center px-4 md:px-8 h-16 w-full shadow-sm">
          <Link
            href="/tasks"
            aria-label="Go back"
            className="p-2 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-[#006c4b]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>

          <h1 className="text-lg md:text-xl font-bold text-slate-900 absolute left-1/2 -translate-x-1/2">
            Create Task
          </h1>

          <button
            type="submit"
            className="bg-[#006c4b] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#005137] transition-all"
          >
            Save
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Left Column: Core Details */}
          <div className="flex flex-col gap-4">
            {/* Title & Project & Color Label */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006c4b] focus:ring-1 focus:ring-[#006c4b] transition-all bg-white"
                />
              </div>

              {/* Custom Dropdown: Category */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Project/Category
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === 'category' ? null : 'category');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left flex justify-between items-center bg-white text-slate-900 focus:outline-none focus:border-[#006c4b]"
                >
                  <span className={category ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                    {categoryOptions.find((opt) => opt.value === category)?.label || 'Select a category'}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-xl">
                    expand_more
                  </span>
                </button>

                {openDropdown === 'category' && (
                  <div className="absolute left-0 right-0 top-[105%] z-30 bg-white border border-slate-200 rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto">
                    {categoryOptions.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setCategory(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                          category === opt.value ? 'font-bold text-[#006c4b] bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(e, opt.value)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                          title="Delete category"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ))}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddingCategory(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#006c4b] font-semibold hover:bg-emerald-50/60 flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      Add New Category
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  Label Color
                </label>
                <div className="flex gap-3 items-center">
                  {colors.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setSelectedColor(hex)}
                      style={{ backgroundColor: hex }}
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                        selectedColor === hex
                          ? 'ring-2 ring-offset-2 ring-emerald-600 scale-105'
                          : 'hover:opacity-90'
                      }`}
                    >
                      {selectedColor === hex && (
                        <span className="material-symbols-outlined text-white text-[16px]">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status, Priority, Date */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80 grid grid-cols-2 gap-4">
              {/* Custom Dropdown: Status */}
              <div className="col-span-2 sm:col-span-1 relative">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Status
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === 'status' ? null : 'status');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left flex justify-between items-center bg-white text-slate-900 focus:outline-none focus:border-[#006c4b]"
                >
                  <span className={status ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                    {statusOptions.find((opt) => opt.value === status)?.label || 'Select status'}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    expand_more
                  </span>
                </button>

                {openDropdown === 'status' && (
                  <div className="absolute left-0 right-0 top-[105%] z-30 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 max-h-48 overflow-y-auto">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStatus(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                          status === opt.value ? 'font-bold text-[#006c4b] bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Dropdown: Priority */}
              <div className="col-span-2 sm:col-span-1 relative">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Priority
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === 'priority' ? null : 'priority');
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-left flex justify-between items-center bg-white text-slate-900 focus:outline-none focus:border-[#006c4b]"
                >
                  <span className={priority ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                    {priorityOptions.find((opt) => opt.value === priority)?.label || 'Select priority'}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    expand_more
                  </span>
                </button>

                {openDropdown === 'priority' && (
                  <div className="absolute left-0 right-0 top-[105%] z-30 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 max-h-48 overflow-y-auto">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setPriority(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                          priority === opt.value ? 'font-bold text-[#006c4b] bg-emerald-50/50' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:border-[#006c4b] transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80 flex flex-col h-full">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 flex-grow min-h-[120px] resize-y placeholder:text-slate-400 focus:outline-none focus:border-[#006c4b] transition-all bg-white"
              />
            </div>
          </div>

          {/* Right Column: Additional Details */}
          <div className="flex flex-col gap-4">
            {/* Assignees */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80">
              <label className="block text-xs font-semibold text-slate-500 mb-3">
                Assigned To
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {assignees.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-[#006c4b] px-3 py-1.5 rounded-full text-xs font-semibold"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignee(name)}
                      className="hover:text-red-500 transition-colors flex items-center"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setIsAssigneeModalOpen(true)}
                  className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-[#006c4b] hover:text-[#006c4b] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>

            {/* Sub-tasks */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80 flex flex-col gap-3">
              <label className="block text-xs font-semibold text-slate-500">
                Sub-tasks
              </label>

              {subTasks.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {subTasks.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between text-sm text-slate-800 bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubTask(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleAddSubTask}
                  className="text-[#006c4b] hover:text-[#005137] transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
                <input
                  type="text"
                  value={newSubTaskInput}
                  onChange={(e) => setNewSubTaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubTask();
                    }
                  }}
                  placeholder="Add Sub-task..."
                  className="flex-grow bg-transparent border-none font-medium text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Attachments dengan Fitur Kompresi Gambar */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200/80 flex flex-col gap-3">
              <label className="block text-xs font-semibold text-slate-500">
                Attachments
              </label>

              {/* Tag / Card File Terunggah */}
              {attachments.length > 0 && (
                <div className="flex flex-col gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#006c4b] flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-lg">description</span>
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500">{file.sizeFormatted}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input File Tersembunyi */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />

              {/* Tombol Unggah File */}
              <button
                type="button"
                disabled={isCompressing}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 mt-1 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-[#006c4b] hover:text-[#006c4b] transition-all gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-2xl">
                  {isCompressing ? 'sync' : 'cloud_upload'}
                </span>
                <span className="text-xs font-semibold">
                  {isCompressing ? 'Compressing Image...' : 'Upload New'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Images auto-compressed to ~300KB
                </span>
              </button>
            </div>
          </div>
        </main>

        {/* Sticky Bottom Action Button */}
        <div className="fixed md:sticky bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-4 border-t border-slate-200 z-40 flex justify-center">
          <button
            type="submit"
            className="w-full max-w-2xl h-12 rounded-full bg-[#006c4b] text-white font-bold text-base shadow-md hover:bg-[#005137] active:scale-[0.99] transition-all"
          >
            Create Task
          </button>
        </div>
      </form>

      {/* Modal Input Category Baru */}
      {isAddingCategory && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddingCategory(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-slate-900">Add New Category</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category Name</label>
              <input
                type="text"
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Design System"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#006c4b] focus:ring-1 focus:ring-[#006c4b]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewCategory(e);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#006c4b] text-white hover:bg-[#005137] transition-all"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Assignee Baru */}
      {isAssigneeModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsAssigneeModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-slate-900">Add Assignee</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Assignee Name</label>
              <input
                type="text"
                autoFocus
                value={newAssigneeName}
                onChange={(e) => setNewAssigneeName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#006c4b] focus:ring-1 focus:ring-[#006c4b]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAssignee();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setIsAssigneeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAssignee}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#006c4b] text-white hover:bg-[#005137] transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
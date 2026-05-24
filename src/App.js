import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  BookOpen, Calendar, Trash2, Edit3, RefreshCw, ChevronDown, ChevronUp,
  User, Lock, LogOut, Award, ClipboardList, BarChart2, CheckCircle,
  Clock, CreditCard, Bell, Check, X
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'IBM Plex Sans','Segoe UI',sans-serif; background:#f8fafc; color:#1e293b; }

    @keyframes cssFadeInUp  { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideInLeft  { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
    @keyframes scaleIn      { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
    @keyframes expandDown   { from{opacity:0;max-height:0} to{opacity:1;max-height:600px} }
    @keyframes pulseEffect  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
    @keyframes modalIn      { from{opacity:0;transform:scale(.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes spin         { to{transform:rotate(360deg)} }

    .fit-fadeup  { animation: cssFadeInUp 0.45s ease-out both; }
    .fit-slidein { animation: slideInLeft 0.35s ease-out both; }
    .fit-scalein { animation: scaleIn 0.4s cubic-bezier(.34,1.56,.64,1) both; }
    .fit-expand  { animation: expandDown 0.35s ease-out both; overflow:hidden; }
    .fit-modalin { animation: modalIn 0.35s cubic-bezier(.34,1.56,.64,1) both; }

    .fit-input {
      width:100%; padding:12px 15px; border:1px solid #cbd5e1; border-radius:6px;
      font-size:14px; font-family:inherit; background:#f8fafc; color:#1e293b;
      transition:border-color .25s,box-shadow .25s,background .25s; outline:none;
    }
    .fit-input:focus { border-color:#0284c7; background:#fff; box-shadow:0 0 0 3px rgba(2,132,199,.15); }

    .fit-opt { display:block; background:#fff; padding:13px 18px; margin:10px 0; border-radius:6px;
      cursor:pointer; border:1px solid #cbd5e1; color:#334155; transition:all .2s; user-select:none; }
    .fit-opt:hover { background:#f8fafc; border-color:#0284c7; color:#0284c7; }
    .fit-opt.selected { background:#e0f2fe; border-color:#0284c7; color:#0369a1; font-weight:600; transform:translateX(5px); }

    .fit-table tr:hover td { background:#f8fafc; color:#0284c7; transition:background .15s; }
    .fit-table th { background:#f1f5f9; color:#0f172a; padding:13px 12px; text-align:left;
      border-bottom:2px solid #cbd5e1; font-weight:600; font-size:13px; }
    .fit-table td { padding:13px 12px; border-bottom:1px solid #e2e8f0; color:#475569; font-size:13px; }

    .fit-class-card { border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; background:#fff;
      box-shadow:0 2px 6px rgba(148,163,184,.06); transition:transform .22s,box-shadow .22s,border-color .22s; }
    .fit-class-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(2,132,199,.12); border-color:#bae6fd; }

    .fit-stat-card { transition:transform .2s,box-shadow .2s; }
    .fit-stat-card:hover { transform:translateY(-3px); box-shadow:0 8px 20px rgba(148,163,184,.18); }

    .fit-btn-primary { background:#0284c7; color:#fff; border:none; padding:13px 20px; border-radius:8px;
      font-size:14px; font-weight:600; font-family:inherit; cursor:pointer;
      transition:background .25s,transform .2s,box-shadow .25s;
      display:inline-flex; align-items:center; justify-content:center; gap:7px; }
    .fit-btn-primary:hover { background:#0369a1; transform:translateY(-2px); box-shadow:0 4px 12px rgba(2,132,199,.3); }
    .fit-btn-primary:active { transform:scale(.97); }

    .fit-btn-success { background:#059669; color:#fff; border:none; padding:10px 18px; border-radius:8px;
      font-size:13px; font-weight:600; font-family:inherit; cursor:pointer;
      transition:background .25s,transform .2s,box-shadow .25s; display:inline-flex; align-items:center; gap:6px; }
    .fit-btn-success:hover { background:#047857; transform:translateY(-2px); box-shadow:0 4px 12px rgba(5,150,105,.3); }

    .fit-btn-danger { background:#dc2626; color:#fff; border:none; padding:10px 18px; border-radius:8px;
      font-size:13px; font-weight:600; font-family:inherit; cursor:pointer;
      transition:background .25s,transform .2s; display:inline-flex; align-items:center; gap:6px; }
    .fit-btn-danger:hover { background:#b91c1c; transform:translateY(-1px); }

    .fit-btn-ghost { background:transparent; border:1px solid #0284c7; color:#0284c7; padding:8px 14px;
      border-radius:6px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer;
      transition:all .2s; display:inline-flex; align-items:center; gap:5px; }
    .fit-btn-ghost:hover { background:#e0f2fe; }

    .fit-btn-warning { background:#f59e0b; color:#fff; border:none; padding:10px 18px; border-radius:8px;
      font-size:13px; font-weight:600; font-family:inherit; cursor:pointer;
      transition:background .25s,transform .2s; display:inline-flex; align-items:center; gap:6px; }
    .fit-btn-warning:hover { background:#d97706; transform:translateY(-1px); }

    .fit-icon-btn { background:transparent; border:none; cursor:pointer; padding:5px;
      border-radius:6px; transition:background .15s; display:inline-flex; align-items:center; }
    .fit-icon-btn:hover { background:#f1f5f9; }

    .fit-qcard { background:#f1f5f9; padding:22px 24px; border-radius:10px; margin-bottom:18px;
      border-left:5px solid #0284c7; transition:transform .2s,box-shadow .2s; }
    .fit-qcard:hover { transform:translateY(-2px); box-shadow:0 5px 15px rgba(148,163,184,.2); }

    .fit-nav-link { display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:8px;
      font-size:14px; font-weight:600; cursor:pointer; color:#64748b; border:none; background:transparent;
      width:100%; text-align:left; transition:background .2s,color .2s; font-family:inherit; }
    .fit-nav-link:hover  { background:#f1f5f9; color:#0284c7; }
    .fit-nav-link.active { background:#e0f2fe; color:#0284c7; }

    .fit-card        { background:#fff; border-radius:12px; box-shadow:0 4px 10px rgba(148,163,184,.1); padding:24px; }
    .fit-card-accent { border-top:5px solid #0284c7; }

    .fit-page-header { background:linear-gradient(135deg,#0284c7 0%,#0369a1 100%); color:#fff;
      padding:18px 28px; border-radius:10px; margin-bottom:28px; font-weight:700;
      text-transform:uppercase; letter-spacing:2px; box-shadow:0 4px 15px rgba(2,132,199,.3); }

    /* Status badges */
    .badge-pass    { color:#059669; background:#d1fae5; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
    .badge-fail    { color:#dc2626; background:#fee2e2; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
    .badge-none    { color:#64748b; background:#f1f5f9; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
    .badge-pending { color:#b45309; background:#fef3c7; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
    .badge-reject  { color:#dc2626; background:#fee2e2; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }

    .fit-timer { font-size:18px; font-weight:700; color:#b45309; background:#fef3c7;
      padding:8px 16px; border-radius:6px; border:1px solid #fde68a; animation:pulseEffect 2s infinite; }

    /* Modal overlay */
    .fit-modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,.55);
      backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; }

    /* Notification dot */
    .notif-dot { position:absolute; top:-4px; right:-4px; width:18px; height:18px;
      background:#dc2626; border-radius:50%; font-size:10px; font-weight:800;
      color:#fff; display:flex; align-items:center; justify-content:center;
      border:2px solid #fff; }

    /* QR shimmer loading */
    .qr-loading { width:200px; height:200px; border-radius:12px;
      background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
      background-size:400px 100%; animation:shimmer 1.2s infinite; }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

    @media (max-width:900px) { .fit-main-grid { grid-template-columns:1fr !important; } }
  `}</style>
);

/* ═══════════════════════════════════════════════════════
   DATA — 140 CÂU HỎI (14 MÔN × 10 CÂU) từ SQL
═══════════════════════════════════════════════════════ */
const questionsDB = {
  1:[
    {q:'Phím tắt để sao chép nội dung là gì?',a:'Ctrl+V',b:'Ctrl+C',c:'Ctrl+X',d:'Ctrl+Z',ans:'B'},
    {q:'Thiết bị nào sau đây là thiết bị NHẬP (Input)?',a:'Màn hình',b:'Loa',c:'Bàn phím',d:'Máy in',ans:'C'},
    {q:'Đơn vị đo dung lượng bộ nhớ nhỏ nhất trong máy tính là?',a:'Byte',b:'Bit',c:'KB',d:'MB',ans:'B'},
    {q:'Hệ điều hành Windows là sản phẩm của hãng nào?',a:'Apple',b:'Google',c:'Microsoft',d:'Oracle',ans:'C'},
    {q:'Phần mở rộng của tập tin Microsoft Word thường là?',a:'.xlsx',b:'.pptx',c:'.docx',d:'.txt',ans:'C'},
    {q:'RAM là viết tắt của cụm từ nào?',a:'Read Access Memory',b:'Random Access Memory',c:'Run Access Memory',d:'Rapid Access Memory',ans:'B'},
    {q:'Để xóa vĩnh viễn một file không đưa vào thùng rác?',a:'Delete',b:'Shift+Delete',c:'Ctrl+Delete',d:'Alt+Delete',ans:'B'},
    {q:'Trình duyệt web mặc định đi kèm Windows 11 là?',a:'Chrome',b:'Firefox',c:'Edge',d:'Safari',ans:'C'},
    {q:'Phần mềm nào sau đây dùng để nén và giải nén file?',a:'Unikey',b:'WinRAR',c:'Excel',d:'Photoshop',ans:'B'},
    {q:'Cổng kết nối màn hình phổ biến nhất hiện nay là?',a:'SATA',b:'HDMI',c:'LAN',d:'PS/2',ans:'B'}
  ],
  2:[
    {q:'Để ngắt trang bắt buộc (Page Break), dùng phím tắt nào?',a:'Enter',b:'Shift+Enter',c:'Ctrl+Enter',d:'Alt+Enter',ans:'C'},
    {q:'Tab nào chứa chức năng Trộn thư (Mail Merge)?',a:'Insert',b:'References',c:'Mailings',d:'Review',ans:'C'},
    {q:'Công cụ Format Painter dùng để làm gì?',a:'Vẽ hình',b:'Sao chép định dạng',c:'Tô màu nền',d:'Chèn ảnh',ans:'B'},
    {q:'Để tạo mục lục tự động, văn bản cần được định dạng?',a:'Bold',b:'Italic',c:'Heading Styles',d:'Underline',ans:'C'},
    {q:'Watermark trong Word dùng để làm gì?',a:'Chèn nhạc',b:'Đóng dấu bản quyền chìm',c:'Tạo khung',d:'Chèn bảng',ans:'B'},
    {q:'Tính năng bảo vệ tài liệu bằng mật khẩu nằm ở đâu?',a:'File > Info',b:'Home',c:'Layout',d:'View',ans:'A'},
    {q:'Để chia cột văn bản (Columns) ta vào tab nào?',a:'Insert',b:'Layout',c:'Design',d:'View',ans:'B'},
    {q:'Footer dùng để chèn thông tin ở vị trí nào?',a:'Đầu trang',b:'Giữa trang',c:'Cuối trang',d:'Bên lề',ans:'C'},
    {q:'Phím F12 trong Word dùng để thực hiện lệnh nào?',a:'Save',b:'Save As',c:'Open',d:'Print',ans:'B'},
    {q:'Để kiểm tra lỗi chính tả và ngữ pháp, ta dùng phím nào?',a:'F1',b:'F5',c:'F7',d:'F9',ans:'C'}
  ],
  3:[
    {q:'Hàm nào dùng để tính tổng các giá trị?',a:'AVERAGE',b:'COUNT',c:'SUM',d:'MAX',ans:'C'},
    {q:'Ký hiệu nào dùng để cố định địa chỉ ô (tuyệt đối)?',a:'!',b:'@',c:'#',d:'$',ans:'D'},
    {q:'Hàm VLOOKUP dùng để làm gì?',a:'Tính tổng',b:'Dò tìm theo cột',c:'Dò tìm theo hàng',d:'Sắp xếp',ans:'B'},
    {q:'Tính năng nào giúp cố định hàng/cột khi cuộn trang?',a:'Filter',b:'Freeze Panes',c:'Split',d:'Sort',ans:'B'},
    {q:'Pivot Table dùng để làm gì?',a:'Vẽ hình',b:'Phân tích & tổng hợp dữ liệu',c:'Gõ văn bản',d:'Tạo Slide',ans:'B'},
    {q:'Kết quả hàm IF(5>3,"Đúng","Sai") là gì?',a:'Đúng',b:'Sai',c:'5',d:'3',ans:'A'},
    {q:'Để nối 2 chuỗi văn bản trong Excel, ta dùng ký hiệu?',a:'+',b:'&',c:'*',d:'/',ans:'B'},
    {q:'Phần mở rộng mặc định của file Excel là?',a:'.docx',b:'.xlsx',c:'.csv',d:'.pdf',ans:'B'},
    {q:'Phím tắt Ctrl + ; dùng để chèn gì?',a:'Giờ hiện tại',b:'Ngày hiện tại',c:'Số trang',d:'Tên file',ans:'B'},
    {q:'Lỗi #VALUE! thường xảy ra khi nào?',a:'Sai tên hàm',b:'Sai kiểu dữ liệu trong phép toán',c:'Chia cho 0',d:'Cột quá hẹp',ans:'B'}
  ],
  4:[
    {q:'Hiệu ứng chuyển tiếp giữa các Slide gọi là gì?',a:'Animation',b:'Transition',c:'Design',d:'Layout',ans:'B'},
    {q:'Để trình chiếu từ Slide đầu tiên, dùng phím nào?',a:'F1',b:'F5',c:'Shift+F5',d:'Esc',ans:'B'},
    {q:'Slide Master dùng để làm gì trong PowerPoint?',a:'Lưu file',b:'Thiết kế bố cục chung cho toàn bộ Slide',c:'Chèn nhạc',d:'Xóa slide',ans:'B'},
    {q:'Định dạng file PowerPoint có thể chỉnh sửa là?',a:'.pptx',b:'.ppsx',c:'.pdf',d:'.mp4',ans:'A'},
    {q:'Hiệu ứng cho từng đối tượng bên trong Slide gọi là?',a:'Transition',b:'Animation',c:'Style',d:'Action',ans:'B'},
    {q:'Để trình chiếu bắt đầu từ Slide đang chọn?',a:'F5',b:'Shift+F5',c:'Alt+F5',d:'Ctrl+F5',ans:'B'},
    {q:'Hiệu ứng Morph có tác dụng gì?',a:'Tạo chuyển động biến hình mượt mà',b:'Tô màu tự động',c:'Xóa chữ',d:'Chèn bảng',ans:'A'},
    {q:'Để thoát khỏi chế độ trình chiếu (Slide Show)?',a:'Enter',b:'Space',c:'Esc',d:'Tab',ans:'C'},
    {q:'Phím tắt để tạo một Slide mới?',a:'Ctrl+N',b:'Ctrl+M',c:'Ctrl+S',d:'Ctrl+P',ans:'B'},
    {q:'Tab nào chứa chức năng chèn Video và Audio?',a:'Home',b:'Insert',c:'Transitions',d:'Review',ans:'B'}
  ],
  5:[
    {q:'ReactJS là thư viện mã nguồn mở của ngôn ngữ nào?',a:'Python',b:'Java',c:'JavaScript',d:'PHP',ans:'C'},
    {q:'Hook nào trong React dùng để quản lý State?',a:'useEffect',b:'useContext',c:'useState',d:'useRef',ans:'C'},
    {q:'JSX là viết tắt của cụm từ nào?',a:'Java XML',b:'JavaScript XML',c:'JSON XML',d:'Jquery XML',ans:'B'},
    {q:'Câu lệnh tạo một dự án React mới bằng npx là?',a:'npm start',b:'npx create-react-app my-app',c:'npm install',d:'node init',ans:'B'},
    {q:'Props được dùng để làm gì?',a:'Lưu dữ liệu nội bộ',b:'Truyền dữ liệu từ cha xuống con',c:'Gọi API',d:'Định dạng CSS',ans:'B'},
    {q:'useEffect mặc định chạy khi nào?',a:'Khi component mount',b:'Khi state thay đổi',c:'Cả A và B đều đúng',d:'Khi click chuột',ans:'C'},
    {q:'Virtual DOM giúp ích gì cho React?',a:'Tăng tốc độ render giao diện',b:'Lưu trữ Database',c:'Kết nối mạng',d:'Bảo mật code',ans:'A'},
    {q:'Cách tốt nhất để điều hướng trang trong React?',a:'Dùng thẻ <a>',b:'Link từ react-router-dom',c:'window.location',d:'href thuần',ans:'B'},
    {q:'Tập tin chứa danh sách thư viện đã cài đặt?',a:'index.js',b:'App.js',c:'package.json',d:'style.css',ans:'C'},
    {q:'Thuộc tính "key" trong danh sách giúp React làm gì?',a:'Xác định phần tử nào thay đổi/thêm/xóa',b:'Tô màu nền',c:'Sắp xếp mảng',d:'Ẩn phần tử',ans:'A'}
  ],
  6:[
    {q:'ASP.NET Core hỗ trợ chạy trên nền tảng nào?',a:'Windows',b:'Linux & macOS',c:'Cả Windows, Linux và macOS',d:'Chỉ Unix',ans:'C'},
    {q:'Cấu trúc xử lý Request trong ASP.NET Core gọi là?',a:'Cây (Tree)',b:'Vòng lặp (Loop)',c:'Đường ống (Pipeline/Middleware)',d:'Queue',ans:'C'},
    {q:'File dùng để cấu hình Connection String là?',a:'Program.cs',b:'Startup.cs',c:'appsettings.json',d:'web.config',ans:'C'},
    {q:'Dependency Injection tích hợp sẵn dùng để?',a:'Kết nối DB',b:'Quản lý vòng đời và cung cấp đối tượng',c:'Vẽ giao diện',d:'Bảo mật mạng',ans:'B'},
    {q:'Entity Framework Core đóng vai trò là gì?',a:'Web Server',b:'ORM Framework',c:'Ngôn ngữ lập trình',d:'Hệ quản trị DB',ans:'B'},
    {q:'Phương thức HTTP nào dùng để LẤY dữ liệu?',a:'POST',b:'PUT',c:'GET',d:'DELETE',ans:'C'},
    {q:'Câu lệnh dotnet nào dùng để chạy ứng dụng?',a:'dotnet start',b:'dotnet run',c:'dotnet build',d:'dotnet exec',ans:'B'},
    {q:'Razor Page sử dụng cú pháp của ngôn ngữ nào?',a:'C#',b:'Java',c:'Python',d:'PHP',ans:'A'},
    {q:'Annotation [ApiController] có tác dụng gì?',a:'Tự động xử lý các tính năng API',b:'Kết nối SQL',c:'Tạo giao diện HTML',d:'Bảo mật Server',ans:'A'},
    {q:'Nơi đăng ký các dịch vụ (Services) cho ứng dụng?',a:'Hàm ConfigureServices',b:'Hàm Main',c:'File JSON',d:'Trong Controller',ans:'A'}
  ],
  7:[
    {q:'Lệnh nào dùng để thay đổi mật khẩu người dùng?',a:'ls',b:'pwd',c:'passwd',d:'cd',ans:'C'},
    {q:'Thư mục nào chứa các file cấu hình của hệ thống Linux?',a:'/bin',b:'/etc',c:'/dev',d:'/home',ans:'B'},
    {q:'Lệnh "sudo" có ý nghĩa là gì?',a:'Xóa file hệ thống',b:'Thực thi với quyền quản trị (Root)',c:'Tắt máy tính',d:'Xem nội dung file',ans:'B'},
    {q:'Trình soạn thảo văn bản phổ biến trên Terminal?',a:'Word',b:'Notepad',c:'Vim/Vi',d:'Excel',ans:'C'},
    {q:'Lệnh cài đặt phần mềm trên Ubuntu/Debian?',a:'yum',b:'apt install',c:'brew',d:'pkg',ans:'B'},
    {q:'Ký hiệu "~" đại diện cho thư mục nào?',a:'Thư mục gốc (/)',b:'Thư mục Home của user',c:'Thư mục tạm (/tmp)',d:'Thư mục rác',ans:'B'},
    {q:'Lệnh tắt máy (shutdown) ngay lập tức?',a:'stop',b:'shutdown now',c:'exit',d:'break',ans:'B'},
    {q:'Lệnh liệt kê các tiến trình đang chạy thời gian thực?',a:'process',b:'task',c:'top',d:'show',ans:'C'},
    {q:'Quyền truy cập "755" có nghĩa là gì?',a:'Chủ sở hữu có mọi quyền, người khác chỉ đọc/chạy',b:'Mọi người có mọi quyền',c:'Không ai có quyền',d:'Chỉ admin mới được đọc',ans:'A'},
    {q:'Dấu nào dùng để ghi đè kết quả lệnh vào một file?',a:'|',b:'>',c:'<',d:'&',ans:'B'}
  ],
  8:[
    {q:'Lỗi được tìm thấy bởi Tester trong giai đoạn kiểm thử gọi là?',a:'Bug',b:'Error',c:'Failure',d:'Mistake',ans:'A'},
    {q:'Kiểm thử mà không quan tâm đến mã nguồn bên trong gọi là?',a:'White Box Testing',b:'Black Box Testing',c:'Grey Box Testing',d:'Unit Testing',ans:'B'},
    {q:'Quy trình STLC bắt đầu bằng giai đoạn nào?',a:'Thiết kế Test Case',b:'Phân tích yêu cầu (Requirement Analysis)',c:'Chạy Test',d:'Báo cáo lỗi',ans:'B'},
    {q:'Regression Testing dùng để làm gì?',a:'Kiểm thử tính năng mới',b:'Kiểm tra xem thay đổi có làm hỏng tính năng cũ không',c:'Kiểm thử hiệu năng',d:'Kiểm thử bảo mật',ans:'B'},
    {q:'Công cụ phổ biến nhất để quản lý lỗi hiện nay?',a:'Photoshop',b:'Jira',c:'Visual Studio',d:'Eclipse',ans:'B'},
    {q:'Unit Test thường do ai thực hiện?',a:'Tester',b:'Developer',c:'Khách hàng',d:'BA',ans:'B'},
    {q:'UAT là viết tắt của cụm từ nào?',a:'Unit Acceptance Test',b:'User Acceptance Test',c:'Usage Analysis Test',d:'Utility Action Test',ans:'B'},
    {q:'Định nghĩa đúng về Manual Testing?',a:'Dùng script tự chạy',b:'Tester thực hiện thao tác thủ công trên app',c:'Kiểm tra bằng máy tính',d:'Không cần con người',ans:'B'},
    {q:'Công cụ Selenium IDE dùng để làm gì?',a:'Kiểm thử giao diện tự động',b:'Kiểm thử hiệu năng',c:'Kiểm thử mạng',d:'Kiểm thử bảo mật',ans:'A'},
    {q:'Thành phần quan trọng nhất của một Test Case?',a:'Mô tả các bước',b:'Kết quả mong đợi (Expected Result)',c:'Trạng thái Pass/Fail',d:'Cả 3 phương án trên',ans:'D'}
  ],
  9:[
    {q:'Kiến trúc Microservices khác Monolith ở điểm nào?',a:'Một khối duy nhất',b:'Tách thành nhiều dịch vụ nhỏ, độc lập',c:'Dùng chung 1 Database duy nhất',d:'Khó triển khai hơn',ans:'B'},
    {q:'API Gateway đóng vai trò gì?',a:'Nơi lưu trữ dữ liệu',b:'Điểm tiếp nhận tập trung mọi yêu cầu từ Client',c:'Xử lý logic giao diện',d:'Máy chủ vật lý',ans:'B'},
    {q:'Service Discovery (Consul/Eureka) giúp gì?',a:'Tự động tìm địa chỉ IP của các service',b:'Xóa các service lỗi',c:'Tạo mã code',d:'Bảo mật mã nguồn',ans:'A'},
    {q:'RabbitMQ được sử dụng để làm gì?',a:'Lưu trữ Database',b:'Truyền tin nhắn bất đồng bộ giữa các service',c:'Vẽ giao diện người dùng',d:'Chạy trang web',ans:'B'},
    {q:'Docker đóng vai trò gì trong Microservices?',a:'Lưu trữ ảnh',b:'Đóng gói service để triển khai nhất quán',c:'Viết code nhanh hơn',d:'Tạo hiệu ứng ảnh',ans:'B'},
    {q:'Tính chất "Resilience" trong hệ thống nghĩa là gì?',a:'Hệ thống không bao giờ lỗi',b:'Khả năng tự phục hồi hoặc chịu lỗi',c:'Hệ thống chạy rất nhanh',d:'Hệ thống dễ sửa đổi',ans:'B'},
    {q:'Giao thức phổ biến nhất để các Microservice giao tiếp trực tiếp?',a:'FTP',b:'HTTP/REST',c:'SMTP',d:'ICMP',ans:'B'},
    {q:'Mô hình Database trong Microservices nên là?',a:'Database Per Service (Mỗi service 1 DB)',b:'Shared Database (Dùng chung 1 DB)',c:'No Database',d:'Excel Spreadsheet',ans:'A'},
    {q:'CI/CD đóng vai trò gì?',a:'Tự động hóa tích hợp và triển khai',b:'Gõ code nhanh',c:'Thiết kế đồ họa',d:'Lưu trữ dữ liệu',ans:'A'},
    {q:'Load Balancer giúp ích gì cho hệ thống?',a:'Phân phối tải đều cho các server',b:'Tăng tốc độ internet',c:'Xóa cache trình duyệt',d:'Tắt bớt máy chủ',ans:'A'}
  ],
  10:[
    {q:'Docker Image là gì?',a:'Một tấm hình chụp server',b:'Bản đóng gói tĩnh chứa app và môi trường',c:'Một tập tin video',d:'Một đoạn script',ans:'B'},
    {q:'Lệnh liệt kê các container ĐANG CHẠY?',a:'docker images',b:'docker ps',c:'docker run',d:'docker pull',ans:'B'},
    {q:'Dockerfile dùng để làm gì?',a:'Lưu dữ liệu người dùng',b:'Tập hợp các chỉ thị để build Image',c:'Cài đặt Windows',d:'Xóa Docker',ans:'B'},
    {q:'Docker Compose sử dụng định dạng file nào?',a:'.xml',b:'.yaml',c:'.json',d:'.txt',ans:'B'},
    {q:'Kubernetes (K8s) là công cụ dùng để?',a:'Tạo Docker Image',b:'Điều phối và quản lý Container ở quy mô lớn',c:'Viết code ReactJS',d:'Thiết kế Database',ans:'B'},
    {q:'Đơn vị nhỏ nhất mà Kubernetes quản lý là gì?',a:'Node',b:'Pod',c:'Container',d:'Cluster',ans:'B'},
    {q:'Lệnh để khởi chạy một Container từ Image?',a:'docker build',b:'docker run',c:'docker push',d:'docker stop',ans:'B'},
    {q:'Nơi lưu trữ và tải về các Image công khai gọi là?',a:'Docker Hub',b:'GitHub',c:'Google Drive',d:'OneDrive',ans:'A'},
    {q:'Ưu điểm của Container so với Máy ảo (VM)?',a:'Nhẹ hơn, khởi động nhanh, dùng chung nhân OS',b:'Bảo mật tuyệt đối hơn',c:'Dễ cài đặt hơn',d:'Tốn nhiều tài nguyên hơn',ans:'A'},
    {q:'K8s Cluster bao gồm hai thành phần chính nào?',a:'Master & Node',b:'Client & Server',c:'App & DB',d:'UI & UX',ans:'A'}
  ],
  11:[
    {q:'Con trỏ (Pointer) trong C++ dùng để lưu trữ gì?',a:'Giá trị số nguyên',b:'Địa chỉ của một vùng nhớ',c:'Tên của biến',d:'Kích thước của mảng',ans:'B'},
    {q:'Toán tử nào dùng để lấy địa chỉ của một biến?',a:'*',b:'&',c:'->',d:'.',ans:'B'},
    {q:'Để cấp phát bộ nhớ động trong C++, ta dùng từ khóa?',a:'malloc',b:'new',c:'create',d:'alloc',ans:'B'},
    {q:'Cú pháp để thực hiện kế thừa trong C++?',a:'.',b:'::',c:':',d:'->',ans:'C'},
    {q:'Hàm ảo (Virtual Function) dùng để thực hiện tính chất nào?',a:'Đóng gói',b:'Đa hình (Polymorphism)',c:'Kế thừa',d:'Trừu tượng',ans:'B'},
    {q:'Tên của hàm hủy (Destructor) bắt đầu bằng ký tự nào?',a:'!',b:'#',c:'~',d:'@',ans:'C'},
    {q:'Thư viện STL là viết tắt của?',a:'Standard Template Library',b:'Simple Tool Library',c:'System Test Logic',d:'Smart Tech Line',ans:'A'},
    {q:'Lệnh nào dùng để giải phóng bộ nhớ đã cấp phát bằng "new"?',a:'free',b:'delete',c:'remove',d:'clear',ans:'B'},
    {q:'Tính năng Template giúp lập trình viên làm gì?',a:'Tạo giao diện mẫu',b:'Viết code tổng quát cho nhiều kiểu dữ liệu',c:'Tạo file mới',d:'Xóa code cũ',ans:'B'},
    {q:'Trong C++, một lớp có thể kế thừa từ nhiều lớp khác không?',a:'Có (Đa kế thừa)',b:'Không',c:'Chỉ kế thừa được từ 2 lớp',d:'Chỉ trên hệ điều hành Linux',ans:'A'}
  ],
  12:[
    {q:'Thư viện Python nào chuyên dùng để xử lý dữ liệu bảng?',a:'Numpy',b:'Pandas',c:'Matplotlib',d:'Keras',ans:'B'},
    {q:'Thư viện nào dùng để vẽ biểu đồ cơ bản trong Python?',a:'Requests',b:'Matplotlib',c:'Django',d:'PyQt',ans:'B'},
    {q:'Cấu trúc dữ liệu "List" trong Python được bao quanh bởi dấu gì?',a:'()',b:'[]',c:'{}',d:'<>',ans:'B'},
    {q:'Numpy mạnh nhất trong việc xử lý đối tượng nào?',a:'Chuỗi văn bản',b:'Mảng và ma trận số học',c:'Hình ảnh',d:'Âm thanh',ans:'B'},
    {q:'Hàm để đọc một file Excel bằng Pandas là?',a:'read_csv()',b:'read_excel()',c:'open_file()',d:'load_data()',ans:'B'},
    {q:'DataFrame trong Pandas có thể hiểu là?',a:'Một mảng 1 chiều',b:'Cấu trúc dữ liệu dạng bảng 2 chiều',c:'Một biến đơn',d:'Một tập tin ảnh',ans:'B'},
    {q:'Công cụ quản lý thư viện (Package Manager) của Python là?',a:'npm',b:'pip',c:'apt',d:'maven',ans:'B'},
    {q:'Đuôi file của Jupyter Notebook là gì?',a:'.py',b:'.ipynb',c:'.txt',d:'.csv',ans:'B'},
    {q:'Thư viện Scikit-Learn dùng để làm gì?',a:'Vẽ biểu đồ 3D',b:'Học máy (Machine Learning)',c:'Tạo website',d:'Gửi yêu cầu HTTP',ans:'B'},
    {q:'Dấu nào dùng để bắt đầu một chú thích (comment) trong Python?',a:'//',b:'/*',c:'#',d:'--',ans:'C'}
  ],
  13:[
    {q:'Blockchain có thể hiểu đơn giản là gì?',a:'Một ứng dụng chat',b:'Một sổ cái kỹ thuật số phân tán',c:'Một loại virus',d:'Một trang web thương mại',ans:'B'},
    {q:'Ngôn ngữ lập trình chính để viết Smart Contract trên Ethereum?',a:'Java',b:'Solidity',c:'Python',d:'C++',ans:'B'},
    {q:'Đặc điểm "Immutability" (Bất biến) nghĩa là?',a:'Dữ liệu dễ thay đổi',b:'Dữ liệu không thể bị sửa xóa sau khi ghi',c:'Dữ liệu tự động biến mất',d:'Ai cũng có thể sửa dữ liệu',ans:'B'},
    {q:'Ethereum khác biệt với Bitcoin chủ yếu ở điểm nào?',a:'Có khả năng chạy Hợp đồng thông minh',b:'Chỉ dùng để thanh toán',c:'Không có tính phi tập trung',d:'Chạy trên mạng nội bộ',ans:'A'},
    {q:'Khối đầu tiên trong một chuỗi Blockchain gọi là?',a:'Final Block',b:'Genesis Block',c:'Error Block',d:'Master Block',ans:'B'},
    {q:'Ví Metamask dùng để làm gì?',a:'Đào Bitcoin',b:'Quản lý khóa và tương tác với các DApp',c:'Chỉnh sửa ảnh',d:'Lưu trữ file Word',ans:'B'},
    {q:'Cơ chế Proof of Work (PoW) yêu cầu gì từ thợ đào?',a:'Sự may mắn',b:'Giải các bài toán phức tạp bằng sức mạnh tính toán',c:'Đặt cọc tiền',d:'Sự bình chọn',ans:'B'},
    {q:'Smart Contract là gì?',a:'Một bản hợp đồng giấy',b:'Đoạn mã tự thực thi khi đủ điều kiện',c:'Một ứng dụng trên điện thoại',d:'Một người trung gian',ans:'B'},
    {q:'NFT (Non-Fungible Token) có đặc điểm gì?',a:'Có thể thay thế lẫn nhau',b:'Độc nhất và không thể thay thế',c:'Không có giá trị',d:'Chỉ là một file ảnh',ans:'B'},
    {q:'Hàm băm (Hash Function) giúp gì trong Blockchain?',a:'Mã hóa dữ liệu',b:'Tạo dấu vân tay kỹ thuật số cho dữ liệu',c:'Tăng dung lượng lưu trữ',d:'Xóa dữ liệu cũ',ans:'B'}
  ],
  14:[
    {q:'UI (User Interface) tập trung vào yếu tố nào?',a:'Cảm xúc người dùng',b:'Giao diện và cách trình bày trực quan',c:'Tốc độ server',d:'Cơ sở dữ liệu',ans:'B'},
    {q:'UX (User Experience) tập trung vào điều gì?',a:'Màu sắc nút bấm',b:'Trải nghiệm và sự hài lòng của người dùng',c:'Mã nguồn trang web',d:'Cấu hình phần cứng',ans:'B'},
    {q:'Công cụ thiết kế giao diện (UI) phổ biến nhất hiện nay là?',a:'Photoshop',b:'Figma',c:'MS Paint',d:'CorelDRAW',ans:'B'},
    {q:'Wireframe là bước nào trong thiết kế?',a:'Đổ màu hoàn thiện',b:'Phác thảo khung xương cấu trúc giao diện',c:'Viết code CSS',d:'Đăng bài lên web',ans:'B'},
    {q:'Màu sắc mang tính "Cảnh báo" thường là màu?',a:'Xanh lá',b:'Đỏ',c:'Xanh dương',d:'Xám',ans:'B'},
    {q:'Nguyên tắc "Mobile First" khuyên gì?',a:'Thiết kế trên PC trước',b:'Thiết kế ưu tiên cho thiết bị di động trước',c:'Chỉ làm app di động',d:'Bỏ qua bản PC',ans:'B'},
    {q:'Độ tương phản (Contrast) tốt giúp ích gì?',a:'Làm đẹp thiết kế',b:'Giúp người dùng dễ đọc nội dung',c:'Tiết kiệm dung lượng',d:'Tăng độ phân giải',ans:'B'},
    {q:'Prototype (Bản mẫu) dùng để làm gì?',a:'Để lập trình viên viết code',b:'Để mô phỏng tương tác trước khi lập trình',c:'Để lưu trữ ảnh',d:'Để thay thế sản phẩm thật',ans:'B'},
    {q:'White Space (Khoảng trắng) có tác dụng gì?',a:'Gây lãng phí diện tích',b:'Giúp thiết kế thông thoáng, tập trung vào nội dung chính',c:'Làm web load chậm',d:'Che giấu lỗi thiết kế',ans:'B'},
    {q:'Grid System (Hệ thống lưới) giúp gì cho Designer?',a:'Chọn màu nhanh',b:'Căn chỉnh các phần tử ngay ngắn và nhất quán',c:'Vẽ icon',d:'Xử lý hiệu ứng động',ans:'B'}
  ]
};

/* ═══════════════════════════════════════════════════════
   COURSES + PRICES (đồng bộ từ SQL)
═══════════════════════════════════════════════════════ */
const coursePrices = {
  1:1200000, 2:1500000, 3:1500000, 4:1500000, 5:3500000,
  6:4500000, 7:3200000, 8:2800000, 9:5500000, 10:4000000,
  11:3000000, 12:3500000, 13:6000000, 14:3200000
};

const initialClasses = [
  {id:1,  name:'Lớp Chứng chỉ CNTT Cơ bản - K1',   lecturer:'Thầy Nguyễn Quốc Anh', examDate:'2026-06-15', syllabus:['Bài 1: Máy tính & Windows — Cấu tạo phần cứng và cách sử dụng Windows 11','Bài 2: Internet & Mail — Cách duyệt web an toàn và quản lý email công việc','Bài 3: Word căn bản — Gõ văn bản, định dạng khổ giấy và căn chỉnh đoạn văn','Bài 4: Excel căn bản — Làm quen bảng tính và các phép toán cộng trừ nhân chia','Bài 5: PowerPoint căn bản — Tạo các slide giới thiệu đơn giản với hình ảnh']},
  {id:2,  name:'Lớp Luyện thi MOS Word - K1',        lecturer:'Thầy Lương Vi Tôn',    examDate:'2026-06-18', syllabus:['Bài 1: Thiết lập trang — Cấu hình khổ giấy, lề và các tùy chọn in ấn nâng cao','Bài 2: Kiểu chữ & Giao diện — Cách tạo tiêu đề tự động và định dạng văn bản đồng nhất','Bài 3: Bảng & Danh sách — Tạo bảng chuyên nghiệp và danh sách đa cấp','Bài 4: Trộn thư hàng loạt — Kỹ thuật Mail Merge để gửi thông báo hàng loạt','Bài 5: Luyện đề thi thử — Giải các bộ đề MOS Word chuẩn cấu trúc Certiport']},
  {id:3,  name:'Lớp Luyện thi MOS Excel - K1',       lecturer:'Thầy Nguyễn Quốc Anh', examDate:'2026-06-20', syllabus:['Bài 1: Hàm và Công thức — Thành thạo các nhóm hàm Toán học, Chuỗi và Thời gian','Bài 2: Hàm điều kiện & Tra cứu — Ứng dụng nâng cao IF, AND, OR, VLOOKUP, HLOOKUP','Bài 3: Quản lý dữ liệu — Sắp xếp, lọc nâng cao và định dạng có điều kiện','Bài 4: Biểu đồ & Báo cáo tổng hợp — Trực quan hóa dữ liệu và tạo PivotTable','Bài 5: Luyện đề thi thử Excel — Thực chiến trên phần mềm thi thật']},
  {id:4,  name:'Lớp Thiết kế PowerPoint - K1',       lecturer:'Thầy Hoàng Nam',       examDate:'2026-06-22', syllabus:['Bài 1: Slide Master — Thiết kế hệ thống layout đồng bộ cho toàn bộ bài thuyết trình','Bài 2: Màu sắc & Phông chữ — Nguyên tắc phối màu chuyên nghiệp và sử dụng font chữ','Bài 3: Đồ họa thông tin — Biến đổi số liệu khô khan thành sơ đồ hình ảnh bắt mắt','Bài 4: Hiệu ứng nâng cao — Kỹ thuật chuyển slide Morph và hoạt họa nâng cao','Bài 5: Kỹ năng thuyết trình — Xuất bản video slide và báo cáo dự án thực tế']},
  {id:5,  name:'Lớp Lập trình Web ReactJS - K1',     lecturer:'Thầy Hoàng Nam',       examDate:'2026-06-25', syllabus:['Bài 1: Khởi động ReactJS — Cấu trúc thư mục, JSX, Component và cách truyền Props','Bài 2: Trạng thái & Hook — Quản lý dữ liệu bằng useState và useEffect chuyên sâu','Bài 3: Biểu mẫu & Điều hướng — Xử lý form và phân trang với React Router','Bài 4: Kết nối API — Gọi dữ liệu từ Backend thông qua Axios / Fetch API','Bài 5: Triển khai sản phẩm — Tối ưu hóa hiệu năng và đưa ứng dụng lên Vercel']},
  {id:6,  name:'Lớp Lập trình ASP.NET Core - K1',    lecturer:'Thầy Nguyễn Quốc Anh', examDate:'2026-06-28', syllabus:['Bài 1: Kiến trúc hệ thống — Tổng quan MVC và cấu hình Middleware trong Program.cs','Bài 2: Entity Framework Core — Kết nối SQL Server bằng kỹ thuật Code-First','Bài 3: Xây dựng Web API — Phát triển các cổng API chuẩn RESTful kết hợp CRUD','Bài 4: Xác thực & Phân quyền — Bảo mật hệ thống với JSON Web Token (JWT)','Bài 5: Triển khai đám mây — Đóng gói và phát hành ứng dụng lên Microsoft Azure']},
  {id:7,  name:'Lớp Quản trị Hệ thống Linux - K1',  lecturer:'Thầy Lương Vi Tôn',    examDate:'2026-07-02', syllabus:['Bài 1: Dòng lệnh cơ bản — Thành thạo các lệnh quản lý tập tin, thư mục và điều hướng','Bài 2: Phân quyền truy cập — Thiết lập quyền file bằng lệnh chmod, chown bảo mật','Bài 3: Quản lý gói phần mềm — Cài đặt và cập nhật ứng dụng qua APT và YUM','Bài 4: Lập trình Shell Script — Viết script tự động hóa tác vụ sao lưu hệ thống','Bài 5: Cấu hình dịch vụ — Vận hành các dịch vụ Web Server Nginx, Apache']},
  {id:8,  name:'Lớp Kiểm thử Phần mềm - K1',        lecturer:'Cô Tạ Linh Chi',       examDate:'2026-07-05', syllabus:['Bài 1: Quy trình kiểm thử — Tìm hiểu vòng đời kiểm thử phần mềm và các cấp độ test','Bài 2: Thiết kế ca kiểm thử — Kỹ thuật phân vùng tương đương và giá trị biên','Bài 3: Quản lý lỗi — Cách viết báo cáo lỗi Bug Report chuẩn trên Jira','Bài 4: Kiểm thử tự động — Viết script kiểm thử giao diện Web bằng Selenium IDE','Bài 5: Kiểm thử hiệu năng — Đo tải và kiểm tra khả năng chịu đựng hệ thống với JMeter']},
  {id:9,  name:'Lớp Kiến trúc Microservices - K1',   lecturer:'Thầy Nguyễn Quốc Anh', examDate:'2026-07-10', syllabus:['Bài 1: Đơn khối vs Vi dịch vụ — Tư duy chuyển đổi kiến trúc và chia tách dịch vụ','Bài 2: Cổng giao tiếp API — Cấu hình API Gateway định tuyến tập trung cho các dịch vụ','Bài 3: Giao tiếp bất đồng bộ — Trao đổi giữa các service thông qua RabbitMQ','Bài 4: Khám phá dịch vụ — Quản lý định danh tự động với Consul / Eureka','Bài 5: Giám sát phân tán — Theo dõi log và vết lỗi bằng Jaeger / Zipkin']},
  {id:10, name:'Lớp Docker & Kubernetes - K1',        lecturer:'Thầy Hoàng Nam',       examDate:'2026-07-12', syllabus:['Bài 1: Docker cốt lõi — Viết Dockerfile để đóng gói mã nguồn ứng dụng độc lập','Bài 2: Quản lý nhiều Container — Chạy cụm dịch vụ (App, DB) cùng lúc với Docker Compose','Bài 3: Kiến trúc Kubernetes — Tìm hiểu cụm K8s, Pod, Node và Cluster','Bài 4: Triển khai & Dịch vụ — Cân bằng tải và tự động phục hồi Pod bị lỗi','Bài 5: Đường ống CI/CD — Kết hợp Docker, K8s vào quy trình tự động hóa GitHub Actions']},
  {id:11, name:'Lớp C++ nâng cao - K1',              lecturer:'Thầy Đặng Thế Vinh',   examDate:'2026-07-15', syllabus:['Bài 1: Con trỏ nâng cao — Quản lý bộ nhớ động và ứng dụng con trỏ thông minh','Bài 2: Lập trình hướng đối tượng — Thừa kế đa hình, class trừu tượng và nạp chồng toán tử','Bài 3: Cấu trúc dữ liệu — Tự cài đặt Ngăn xếp, Hàng đợi, Danh sách liên kết','Bài 4: Thư viện chuẩn STL — Sử dụng tối ưu Vector, Map, Set, List','Bài 5: Lập trình đa luồng — Tối ưu hóa tốc độ xử lý phần cứng CPU']},
  {id:12, name:'Lớp Phân tích dữ liệu Python - K1',  lecturer:'Thầy Lương Vi Tôn',    examDate:'2026-07-18', syllabus:['Bài 1: Python nâng cao — Xử lý cấu trúc dữ liệu phức tạp, Lambda và List Comprehension','Bài 2: Làm sạch dữ liệu với Pandas — Đọc file Excel/CSV, xử lý dữ liệu khuyết thiếu','Bài 3: Tính toán ma trận — Đại số tuyến tính mảng đa chiều với NumPy','Bài 4: Trực quan hóa dữ liệu — Vẽ biểu đồ phân tích xu hướng bằng Matplotlib','Bài 5: Dự án phân tích thực tế — Làm báo cáo phân tích dữ liệu kinh doanh doanh nghiệp']},
  {id:13, name:'Lớp Lập trình Blockchain - K1',      lecturer:'Thầy Đặng Thế Vinh',   examDate:'2026-07-20', syllabus:['Bài 1: Mật mã học — Cơ chế mã hóa băm SHA-256 và kiến trúc sổ cái phân tán','Bài 2: Ngôn ngữ Solidity — Học lập trình hợp đồng thông minh trên Ethereum','Bài 3: Hợp đồng thông minh — Khởi tạo, viết mã logic xử lý và biên dịch hợp đồng','Bài 4: Tích hợp Web3 — Kết nối giao diện Frontend với ví điện tử MetaMask bằng Web3.js','Bài 5: Triển khai ứng dụng phi tập trung — Đưa DApp lên mạng thử nghiệm Testnet']},
  {id:14, name:'Lớp UI/UX Design - K1',              lecturer:'Thầy Hoàng Nam',       examDate:'2026-07-25', syllabus:['Bài 1: Tư duy thiết kế — Nghiên cứu hành vi người dùng, vẽ bản đồ trải nghiệm UX','Bài 2: Thiết kế khung — Phác thảo Layout ứng dụng sơ khai trên giấy và phần mềm','Bài 3: Figma chuyên sâu — Thành thạo Auto Layout, Component, Style Guide','Bài 4: Mẫu giao diện tương tác — Tạo hiệu ứng chuyển động mô phỏng ứng dụng thật','Bài 5: Kiểm thử giao diện — Đánh giá sản phẩm trực quan và bàn giao cho Developer']}
];

const mockAccounts = [
  {username:'student_dung', password:'123456', role:'Student', fullName:'Nguyễn Văn Dũng', id:1},
  {username:'student_ha',   password:'123456', role:'Student', fullName:'Trần Thị Hà',     id:2},
  {username:'student01',    password:'123456', role:'Student', fullName:'Lê Hoàng Long',   id:3},
  {username:'teacher_nam',  password:'123456', role:'Teacher', fullName:'Thầy Hoàng Nam',  id:99},
  {username:'teacher_thuy', password:'123456', role:'Teacher', fullName:'Cô Thu Thủy',     id:100},
  {username:'admin',        password:'123456', role:'Teacher', fullName:'Quản trị viên FIT',id:101}
];

const initialStudents = [
  {id:1, fullName:'Nguyễn Văn Dũng', phone:'0987654321'},
  {id:2, fullName:'Trần Thị Hà',     phone:'0912345678'},
  {id:3, fullName:'Lê Hoàng Long',   phone:'0933445566'}
];

/* ═══════════════════════════════════════════════════════
   ENROLLMENT HELPERS (localStorage key: enrollmentsDB)
   Mỗi record: { id, studentId, studentName, classId,
     className, price, payCode, status, requestDate, approvedDate }
   status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối'
═══════════════════════════════════════════════════════ */
const getEnrollments  = ()     => JSON.parse(localStorage.getItem('enrollmentsDB')) || [];
const saveEnrollments = (list) => localStorage.setItem('enrollmentsDB', JSON.stringify(list));

/* ═══════════════════════════════════════════════════════
   EMAIL NOTIFICATION — dùng EmailJS (miễn phí)
   Cấu hình tại: https://www.emailjs.com
   Điền SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY của bạn vào đây
═══════════════════════════════════════════════════════ */
const EMAILJS_SERVICE_ID  = 'service_qsd3ofq';
const EMAILJS_TEMPLATE_ID = 'template_o4ibbxi';
const EMAILJS_PUBLIC_KEY  = 'zAGGEef3ImTXgd554';
const NOTIFY_EMAIL        = 'nguyendungdbd1@gmail.com';

const sendPaymentEmail = async (enrollData) => {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id:     EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email:    NOTIFY_EMAIL,
          to_name:     'Admin FIT Center',
          student_name: enrollData.studentName,
          course_name:  enrollData.className,
          pay_code:     enrollData.payCode,
          amount:       (enrollData.price || 0).toLocaleString('vi-VN') + ' ₫',
          request_date: enrollData.requestDate,
          reply_to:     NOTIFY_EMAIL,
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.warn('EmailJS chưa cấu hình — fallback mailto', err);
    return false;
  }
};

/* Fallback: mở ứng dụng email mặc định nếu EmailJS chưa cấu hình */
const openMailtoFallback = (enrollData) => {
  const subject = encodeURIComponent(`[FIT CENTER] Đăng ký khóa học: ${enrollData.className}`);
  const body    = encodeURIComponent(
    `Học viên: ${enrollData.studentName}\n` +
    `Khóa học: ${enrollData.className}\n` +
    `Học phí: ${(enrollData.price||0).toLocaleString('vi-VN')} ₫\n` +
    `Mã CK: ${enrollData.payCode}\n` +
    `Ngày gửi: ${enrollData.requestDate}\n\n` +
    `Vui lòng vào hệ thống để xét duyệt.`
  );
  window.open(`mailto:${NOTIFY_EMAIL}?subject=${subject}&body=${body}`);
};

/* ═══════════════════════════════════════════════════════
   PAYMENT QR MODAL — MB Bank : 0369483469 / NGUYEN VAN DUNG
═══════════════════════════════════════════════════════ */
const BANK_ID    = 'MB';
const BANK_ACCT  = '0369483469';
const BANK_NAME  = 'NGUYEN VAN DUNG';

const PaymentModal = ({ cls, user, onClose, onConfirm }) => {
  const price    = coursePrices[cls.id] || 10000;
  const payCode  = `FIT${cls.id}SV${user.id}`;
  const [imgOk,   setImgOk]   = useState(false);
  const [sending, setSending] = useState(false);

  const addInfo = encodeURIComponent(`${payCode} ${user.fullName}`);
  const acctEnc = encodeURIComponent(BANK_NAME);
  const qrUrl   = `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCT}-compact2.png`
                + `?amount=${price}&addInfo=${addInfo}&accountName=${acctEnc}`;

  const handleConfirm = async () => {
    setSending(true);
    const enrollData = {
      studentName: user.fullName,
      className:   cls.name,
      payCode,
      price,
      requestDate: new Date().toLocaleString('vi-VN'),
    };
    const ok = await sendPaymentEmail(enrollData);
    if (!ok) openMailtoFallback(enrollData);
    setSending(false);
    onConfirm(payCode);
  };

  return (
    <div className="fit-modal-overlay" onClick={onClose}>
      <div className="fit-card fit-card-accent fit-modalin"
        style={{width:460, maxWidth:'95vw'}} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#0284c7,#0369a1)',
              display:'flex', alignItems:'center', justifyContent:'center'}}>
              <CreditCard size={19} color="#fff"/>
            </div>
            <div>
              <div style={{fontWeight:800, color:'#1e293b', fontSize:16}}>Thanh toán học phí</div>
              <div style={{fontSize:12, color:'#64748b'}}>Quét mã QR để hoàn tất đăng ký</div>
            </div>
          </div>
          <button className="fit-icon-btn" onClick={onClose}><X size={18} color="#94a3b8"/></button>
        </div>

        {/* Course info */}
        <div style={{background:'#f8fafc', borderRadius:10, padding:'14px 16px', marginBottom:16,
          border:'1px solid #e2e8f0'}}>
          <div style={{fontSize:12, color:'#64748b', marginBottom:4, textTransform:'uppercase', letterSpacing:.6}}>Khóa học đăng ký</div>
          <div style={{fontWeight:700, color:'#1e293b', fontSize:15, marginBottom:8}}>{cls.name}</div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span style={{fontSize:13, color:'#64748b', display:'flex', alignItems:'center', gap:4}}>
              <User size={13}/> {cls.lecturer}
            </span>
            <span style={{fontWeight:800, fontSize:20, color:'#0284c7'}}>
              {price.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div style={{display:'flex', gap:20, alignItems:'flex-start', marginBottom:16}}>
          {/* QR image */}
          <div style={{flexShrink:0}}>
            <div style={{position:'relative', width:180, height:180}}>
              {!imgOk && <div className="qr-loading" style={{width:180, height:180}}/>}
              <img
                src={qrUrl}
                alt="QR VietQR MB Bank"
                width={180} height={180}
                style={{borderRadius:12, border:'2px solid #e2e8f0',
                  boxShadow:'0 4px 16px rgba(2,132,199,.15)',
                  display: imgOk ? 'block':'none'}}
                onLoad={() => setImgOk(true)}
                onError={() => setImgOk(true)}
              />
            </div>
          </div>

          {/* Bank info */}
          <div style={{flex:1}}>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11, color:'#94a3b8', marginBottom:3, textTransform:'uppercase', letterSpacing:.6}}>Ngân hàng</div>
              <div style={{fontWeight:700, color:'#1e293b', fontSize:14}}>MB Bank (MBBank)</div>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11, color:'#94a3b8', marginBottom:3, textTransform:'uppercase', letterSpacing:.6}}>Số tài khoản</div>
              <div style={{fontWeight:800, color:'#0284c7', fontSize:16, letterSpacing:.5}}>{BANK_ACCT}</div>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11, color:'#94a3b8', marginBottom:3, textTransform:'uppercase', letterSpacing:.6}}>Chủ tài khoản</div>
              <div style={{fontWeight:700, color:'#1e293b', fontSize:13}}>{BANK_NAME}</div>
            </div>
            <div>
              <div style={{fontSize:11, color:'#94a3b8', marginBottom:3, textTransform:'uppercase', letterSpacing:.6}}>Số tiền</div>
              <div style={{fontWeight:800, color:'#059669', fontSize:15}}>
                {price.toLocaleString('vi-VN')} ₫
              </div>
            </div>
          </div>
        </div>

        {/* Pay code */}
        <div style={{background:'#fef3c7', border:'1px solid #fde68a', borderRadius:8,
          padding:'10px 14px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{fontSize:12, color:'#92400e', fontWeight:700}}>📝 Nội dung chuyển khoản:</span>
          <span style={{fontSize:14, fontWeight:800, color:'#b45309', fontFamily:'monospace', letterSpacing:.5}}>
            {payCode} {user.fullName}
          </span>
        </div>

        {/* Notice */}
        <div style={{background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8,
          padding:'10px 14px', marginBottom:16, fontSize:13, color:'#1d4ed8', lineHeight:1.6}}>
          <b>Lưu ý:</b> Sau khi chuyển khoản xong, nhấn <b>"Xác nhận đã thanh toán"</b>.
          Hệ thống sẽ <b>gửi email thông báo</b> tới quản trị viên và giảng viên sẽ
          xét duyệt trong vòng <b>24 giờ</b>.
        </div>

        {/* Email notice */}
        <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8,
          padding:'8px 12px', marginBottom:16, fontSize:12, color:'#166534',
          display:'flex', alignItems:'center', gap:6}}>
          ✉️ Thông báo sẽ gửi tới: <b>{NOTIFY_EMAIL}</b>
        </div>

        {/* Buttons */}
        <div style={{display:'flex', gap:10}}>
          <button className="fit-btn-ghost" onClick={onClose} style={{flex:1}} disabled={sending}>Hủy</button>
          <button className="fit-btn-primary" onClick={handleConfirm} style={{flex:2}} disabled={sending}>
            {sending
              ? <><span style={{display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,.4)',
                  borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite'}}/> Đang gửi...</>
              : <><Check size={16}/> Xác nhận đã thanh toán</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════ */
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handle = (e) => {
    e.preventDefault(); setError('');
    const acc = mockAccounts.find(a =>
      a.username.toLowerCase() === username.trim().toLowerCase() &&
      a.password === password.trim()
    );
    if (acc) onLogin({role:acc.role, fullName:acc.fullName, id:acc.id});
    else setError('Tài khoản hoặc mật khẩu không chính xác!');
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#0284c7 0%,#0369a1 100%)'}}>
      <div className="fit-card fit-card-accent fit-scalein"
        style={{width:390, boxShadow:'0 20px 50px rgba(2,132,199,.3)'}}>

        <div style={{textAlign:'center', marginBottom:30}}>
          <div style={{width:66, height:66, borderRadius:18,
            background:'linear-gradient(135deg,#0284c7,#0369a1)',
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 16px', boxShadow:'0 8px 20px rgba(2,132,199,.4)'}}>
            <BookOpen size={32} color="#fff"/>
          </div>
          <h2 style={{color:'#1e293b', fontSize:22, fontWeight:800}}>FIT CENTER</h2>
          <p style={{color:'#64748b', fontSize:13, marginTop:5}}>Đăng nhập vào hệ thống quản lý học trực tuyến</p>
        </div>

        <form onSubmit={handle} style={{display:'flex', flexDirection:'column', gap:18}}>
          <div>
            <label style={{display:'block', fontSize:12, fontWeight:700, color:'#475569',
              marginBottom:8, textTransform:'uppercase', letterSpacing:.8}}>Tài khoản</label>
            <div style={{position:'relative'}}>
              <span style={{position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}>
                <User size={16}/>
              </span>
              <input className="fit-input" type="text" placeholder="Nhập Username..."
                value={username} onChange={e => setUsername(e.target.value)}
                style={{paddingLeft:40}} required/>
            </div>
          </div>
          <div>
            <label style={{display:'block', fontSize:12, fontWeight:700, color:'#475569',
              marginBottom:8, textTransform:'uppercase', letterSpacing:.8}}>Mật khẩu</label>
            <div style={{position:'relative'}}>
              <span style={{position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94a3b8'}}>
                <Lock size={16}/>
              </span>
              <input className="fit-input" type="password" placeholder="Nhập Password..."
                value={password} onChange={e => setPassword(e.target.value)}
                style={{paddingLeft:40}} required/>
            </div>
          </div>
          {error && (
            <div style={{background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:6,
              padding:'10px 14px', color:'#dc2626', fontSize:13, fontWeight:600, textAlign:'center'}}>
              {error}
            </div>
          )}
          <button className="fit-btn-primary" type="submit"
            style={{width:'100%', padding:'14px', marginTop:4, fontSize:15}}>
            Đăng nhập hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   STUDENT DASHBOARD
═══════════════════════════════════════════════════════ */
const StudentDashboard = ({ user, onLogout }) => {
  const [classList, setClassList]     = useState([]);
  const [expanded, setExpanded]       = useState({});
  const [payModal, setPayModal]       = useState(null); // cls object
  const [inExam, setInExam]           = useState(false);
  const [activeExam, setActiveExam]   = useState(null);
  const [answers, setAnswers]         = useState({});
  const [result, setResult]           = useState(null);
  const [toast, setToast]             = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const loadData = () => {
    const globalCls    = JSON.parse(localStorage.getItem('centerClassesDB')) || initialClasses;
    const allGrades    = JSON.parse(localStorage.getItem('examResultsDB'))   || [];
    const myGrades     = allGrades.filter(r => r.studentId === user?.id);
    const enrollments  = getEnrollments();

    setClassList(globalCls.map(c => {
      const enroll   = enrollments.find(e => e.studentId === user.id && e.classId === c.id);
      const attempts = myGrades.filter(r => r.classId === c.id);
      const last     = attempts.slice(-1)[0];
      return {
        ...c,
        enrollment: enroll || null,
        score:   last ? last.score.toFixed(1) : null,
        examStatus: last ? last.status : 'Chưa thi',
        history: attempts
      };
    }));
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Thanh toán & gửi yêu cầu đăng ký ── */
  const confirmPayment = (cls, payCode) => {
    const all = getEnrollments();
    all.push({
      id:          Date.now(),
      studentId:   user.id,
      studentName: user.fullName,
      classId:     cls.id,
      className:   cls.name,
      price:       coursePrices[cls.id] || 0,
      payCode,
      status:      'Chờ duyệt',
      requestDate: new Date().toLocaleString('vi-VN'),
      approvedDate: null
    });
    saveEnrollments(all);
    setPayModal(null);
    loadData();
    showToast('✅ Đã gửi yêu cầu đăng ký! Giảng viên sẽ xét duyệt sớm.');
  };

  /* ── Vào thi ── */
  const startExam = (cls) => {
    setActiveExam({...cls, questions: questionsDB[cls.id] || questionsDB[1]});
    setAnswers({}); setResult(null); setInExam(true);
  };

  const submitExam = () => {
    let correct = 0;
    activeExam.questions.forEach((q,i) => { if (answers[i] === q.ans) correct++; });
    const score  = (correct / activeExam.questions.length) * 10;
    const status = score >= 5 ? 'Đạt' : 'Thi lại';
    const db = JSON.parse(localStorage.getItem('examResultsDB')) || [];
    db.push({studentId:user.id, studentName:user.fullName, classId:activeExam.id,
      className:activeExam.name, score, status, date:new Date().toLocaleString('vi-VN')});
    localStorage.setItem('examResultsDB', JSON.stringify(db));
    setResult({score, status, correct});
    loadData();
  };

  /* ── Result screen ── */
  if (inExam && result) {
    const passed = result.status === 'Đạt';
    const pct    = Math.round((result.correct / activeExam.questions.length) * 100);
    return (
      <div style={{minHeight:'100vh', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div className="fit-card fit-card-accent fit-scalein" style={{width:460, textAlign:'center'}}>
          <div style={{width:112, height:112, borderRadius:'50%', margin:'0 auto 22px',
            background: passed ? '#d1fae5':'#fee2e2',
            border:`5px solid ${passed?'#059669':'#dc2626'}`,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            boxShadow:`0 8px 24px ${passed?'rgba(5,150,105,.2)':'rgba(220,38,38,.2)'}`}}>
            <span style={{fontSize:34, fontWeight:800, color:passed?'#059669':'#dc2626', lineHeight:1.1}}>
              {result.score.toFixed(1)}
            </span>
            <span style={{fontSize:13, color:'#64748b'}}>/10</span>
          </div>
          <h2 style={{color:passed?'#059669':'#dc2626', marginBottom:8, fontSize:20}}>
            {passed ? '🎉 CHÚC MỪNG — ĐẠT!' : '❌ CHƯA ĐẠT'}
          </h2>
          <p style={{color:'#64748b', marginBottom:20, fontSize:14}}>
            Trả lời đúng <b style={{color:'#0284c7'}}>{result.correct}</b> / {activeExam.questions.length} câu &nbsp;·&nbsp;
            Trạng thái: <b style={{color:passed?'#059669':'#dc2626'}}>{result.status}</b>
          </p>
          <div style={{background:'#f1f5f9', borderRadius:20, height:10, marginBottom:24, overflow:'hidden'}}>
            <div style={{height:'100%', width:`${pct}%`,
              background: passed?'linear-gradient(90deg,#34d399,#059669)':'linear-gradient(90deg,#fca5a5,#dc2626)',
              borderRadius:20, transition:'width 1s ease'}}/>
          </div>
          <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
            {!passed && (
              <button className="fit-btn-warning" onClick={() => {setResult(null); setAnswers({});}}>
                <RefreshCw size={15}/> Thi lại ngay
              </button>
            )}
            <button className="fit-btn-primary" onClick={() => {setInExam(false); setResult(null);}}>
              ← Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Exam room ── */
  if (inExam && activeExam) {
    return (
      <div style={{minHeight:'100vh', background:'#f8fafc', padding:'30px 20px'}}>
        <div style={{maxWidth:760, margin:'0 auto'}}>
          <div className="fit-page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontSize:10, letterSpacing:3, opacity:.8, marginBottom:4}}>BÀI KIỂM TRA TRỰC TUYẾN</div>
              <div style={{fontSize:17, fontWeight:700, textTransform:'none', letterSpacing:.3}}>{activeExam.name}</div>
            </div>
            <div className="fit-timer">{activeExam.questions.length} câu</div>
          </div>
          {activeExam.questions.map((q,idx) => (
            <div key={idx} className="fit-qcard fit-slidein" style={{animationDelay:`${idx*0.04}s`}}>
              <p style={{margin:'0 0 12px', fontWeight:700, color:'#1e293b', fontSize:15}}>
                <span style={{color:'#0284c7', marginRight:8}}>Câu {idx+1}.</span>{q.q}
              </p>
              {['A','B','C','D'].map(opt => (
                <label key={opt} className={`fit-opt${answers[idx]===opt?' selected':''}`}>
                  <input type="radio" name={`q-${idx}`} checked={answers[idx]===opt}
                    onChange={() => setAnswers({...answers,[idx]:opt})}
                    style={{marginRight:10, accentColor:'#0284c7'}}/>
                  <b style={{marginRight:6}}>{opt}.</b>
                  {opt==='A'?q.a:opt==='B'?q.b:opt==='C'?q.c:q.d}
                </label>
              ))}
            </div>
          ))}
          <div style={{background:'#fff', padding:'16px 24px', borderRadius:12,
            boxShadow:'0 4px 10px rgba(148,163,184,.15)', position:'sticky', bottom:16,
            display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #e2e8f0'}}>
            <button className="fit-btn-danger" onClick={() => setInExam(false)}>Hủy bỏ</button>
            <span style={{color:'#64748b', fontSize:13}}>
              Đã trả lời: <b style={{color:'#0284c7'}}>{Object.keys(answers).length}</b> / {activeExam.questions.length}
            </span>
            <button className="fit-btn-primary" onClick={submitExam} style={{fontSize:15, padding:'12px 28px'}}>
              Nộp bài chấm điểm
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main dashboard ── */
  const enrolled = classList.filter(c => c.enrollment?.status === 'Đã duyệt').length;
  const passed   = classList.filter(c => c.examStatus === 'Đạt').length;
  const pending  = classList.filter(c => c.enrollment?.status === 'Chờ duyệt').length;

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#f8fafc'}}>
      {/* Sidebar */}
      <aside style={{width:252, background:'#fff', borderRight:'1px solid #e2e8f0',
        padding:'22px 16px', display:'flex', flexDirection:'column', gap:4,
        boxShadow:'2px 0 8px rgba(148,163,184,.06)'}}>
        <div style={{marginBottom:26, paddingBottom:18, borderBottom:'1px solid #e2e8f0'}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:40, height:40, borderRadius:10,
              background:'linear-gradient(135deg,#0284c7,#0369a1)',
              display:'flex', alignItems:'center', justifyContent:'center'}}>
              <BookOpen size={19} color="#fff"/>
            </div>
            <div>
              <div style={{fontWeight:800, color:'#0284c7', fontSize:15}}>FIT CENTER</div>
              <div style={{fontSize:11, color:'#94a3b8'}}>Cổng học viên</div>
            </div>
          </div>
        </div>
        <button className="fit-nav-link active"><BookOpen size={16}/> Danh sách lớp học</button>
        <div style={{marginTop:'auto', paddingTop:18, borderTop:'1px solid #e2e8f0'}}>
          <div style={{padding:'12px 14px', background:'#f8fafc', borderRadius:8,
            marginBottom:10, border:'1px solid #e2e8f0'}}>
            <div style={{fontSize:11, color:'#94a3b8', marginBottom:2, textTransform:'uppercase', letterSpacing:.6}}>Học viên</div>
            <div style={{fontWeight:700, color:'#1e293b', fontSize:14}}>{user.fullName}</div>
          </div>
          <button className="fit-nav-link" onClick={onLogout} style={{color:'#dc2626'}}>
            <LogOut size={15}/> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{flex:1, padding:'30px', overflowY:'auto', maxHeight:'100vh'}}>
        {/* Toast */}
        {toast && (
          <div className="fit-scalein" style={{position:'fixed', top:20, right:20, zIndex:2000,
            background:'#1e293b', color:'#fff', padding:'12px 20px', borderRadius:10,
            fontSize:14, fontWeight:600, boxShadow:'0 8px 24px rgba(0,0,0,.2)'}}>
            {toast}
          </div>
        )}

        <div className="fit-page-header">
          <div style={{fontSize:10, letterSpacing:3, opacity:.75, marginBottom:4}}>KHÔNG GIAN HỌC TẬP</div>
          <div style={{fontSize:20, fontWeight:700, textTransform:'none', letterSpacing:.3}}>
            Chào mừng trở lại, {user.fullName}!
          </div>
        </div>

        {/* Stat cards */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:26}}>
          {[
            {label:'Đã được duyệt', value:enrolled, icon:<CheckCircle size={20}/>, color:'#059669'},
            {label:'Kết quả Đạt',   value:passed,   icon:<Award size={20}/>,       color:'#0284c7'},
            {label:'Chờ xét duyệt', value:pending,  icon:<Clock size={20}/>,       color:'#f59e0b'}
          ].map((s,i) => (
            <div key={i} className="fit-card fit-stat-card fit-fadeup"
              style={{display:'flex', alignItems:'center', gap:16, animationDelay:`${i*0.1}s`}}>
              <div style={{width:46, height:46, borderRadius:12, background:`${s.color}18`,
                display:'flex', alignItems:'center', justifyContent:'center', color:s.color}}>{s.icon}</div>
              <div>
                <div style={{fontSize:26, fontWeight:800, color:s.color, lineHeight:1}}>{s.value}</div>
                <div style={{fontSize:12, color:'#64748b', marginTop:3}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Class list */}
        <div className="fit-card" style={{padding:0, overflow:'hidden'}}>
          <div style={{padding:'16px 22px', borderBottom:'1px solid #e2e8f0',
            background:'#f8fafc', display:'flex', alignItems:'center', gap:8}}>
            <ClipboardList size={17} color="#0284c7"/>
            <h3 style={{margin:0, color:'#1e293b', fontSize:15, fontWeight:700}}>
              Tất cả lớp học phần ({classList.length} lớp)
            </h3>
          </div>
          <div style={{padding:'16px 18px', display:'flex', flexDirection:'column', gap:12}}>
            {classList.map((c,i) => {
              const enroll   = c.enrollment;
              const status   = enroll?.status;
              const isOpen   = expanded[c.id];
              const price    = coursePrices[c.id] || 0;

              // Nút hành động
              let actionBtn = null;
              if (!enroll) {
                actionBtn = (
                  <button className="fit-btn-primary" style={{padding:'8px 14px', fontSize:13}}
                    onClick={() => setPayModal(c)}>
                    <CreditCard size={14}/> Đăng ký & Thanh toán
                  </button>
                );
              } else if (status === 'Chờ duyệt') {
                actionBtn = (
                  <button disabled style={{padding:'8px 14px', fontSize:13, border:'1px dashed #f59e0b',
                    background:'#fef3c7', color:'#b45309', borderRadius:8, cursor:'default',
                    display:'inline-flex', alignItems:'center', gap:6, fontWeight:600}}>
                    <Clock size={13}/> Chờ xét duyệt
                  </button>
                );
              } else if (status === 'Từ chối') {
                actionBtn = (
                  <button className="fit-btn-warning" style={{padding:'8px 14px', fontSize:13}}
                    onClick={() => setPayModal(c)}>
                    <RefreshCw size={13}/> Đăng ký lại
                  </button>
                );
              } else if (status === 'Đã duyệt') {
                actionBtn = (
                  <button className="fit-btn-success" style={{padding:'8px 14px', fontSize:13}}
                    onClick={() => startExam(c)}>
                    {c.examStatus==='Thi lại'
                      ? <><RefreshCw size={13}/> Thi lại</>
                      : '▶ Vào thi'}
                  </button>
                );
              }

              // Badge trạng thái đăng ký
              const statusBadge = !enroll ? null :
                status === 'Chờ duyệt' ? <span className="badge-pending">⏳ Chờ duyệt</span> :
                status === 'Từ chối'   ? <span className="badge-reject">✗ Từ chối</span> :
                status === 'Đã duyệt'  ?
                  (c.examStatus === 'Đạt'     ? <span className="badge-pass">✓ Đạt</span> :
                   c.examStatus === 'Thi lại' ? <span className="badge-fail">✗ Thi lại</span> :
                   <span className="badge-pass">✓ Đã duyệt</span>) : null;

              return (
                <div key={c.id} className="fit-class-card fit-fadeup" style={{animationDelay:`${i*0.04}s`}}>
                  <div style={{padding:'16px 18px', display:'flex', justifyContent:'space-between',
                    alignItems:'center', flexWrap:'wrap', gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:5}}>
                        <span style={{background:'#e0f2fe', color:'#0284c7', fontWeight:800,
                          fontSize:11, padding:'2px 8px', borderRadius:5}}>#{c.id}</span>
                        <h4 style={{margin:0, color:'#1e293b', fontSize:14, fontWeight:700}}>{c.name}</h4>
                      </div>
                      <div style={{display:'flex', gap:14, fontSize:13, color:'#64748b', flexWrap:'wrap'}}>
                        <span style={{display:'flex', alignItems:'center', gap:4}}><User size={13}/> {c.lecturer}</span>
                        <span style={{display:'flex', alignItems:'center', gap:4}}><Calendar size={13}/> {c.examDate}</span>
                        <span style={{display:'flex', alignItems:'center', gap:4, color:'#0284c7', fontWeight:700}}>
                          <CreditCard size={13}/> {price.toLocaleString('vi-VN')} ₫
                        </span>
                        {c.score && (
                          <span style={{display:'flex', alignItems:'center', gap:4, color:'#0284c7', fontWeight:700}}>
                            <Award size={13}/> {c.score}/10
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
                      {statusBadge}
                      <button className="fit-btn-ghost" style={{padding:'6px 12px'}}
                        onClick={() => setExpanded(p => ({...p,[c.id]:!p[c.id]}))}>
                        {isOpen ? <><ChevronUp size={13}/> Ẩn</> : <><ChevronDown size={13}/> Lộ trình</>}
                      </button>
                      {actionBtn}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="fit-expand" style={{borderTop:'1px solid #e0f2fe',
                      background:'#f8fafc', padding:'14px 18px', borderLeft:'4px solid #0284c7'}}>
                      <p style={{margin:'0 0 10px', fontWeight:700, color:'#1e293b', fontSize:13}}>
                        📋 Nội dung bài học:
                      </p>
                      <ul style={{margin:0, paddingLeft:20, fontSize:13, color:'#475569', lineHeight:'22px'}}>
                        {c.syllabus?.map((s,i) => <li key={i}>{s}</li>)}
                      </ul>
                      {enroll && (
                        <div style={{marginTop:12, paddingTop:10, borderTop:'1px dashed #cbd5e1',
                          fontSize:12, color:'#64748b'}}>
                          <b>Mã thanh toán:</b> {enroll.payCode} &nbsp;·&nbsp;
                          <b>Ngày đăng ký:</b> {enroll.requestDate}
                          {enroll.approvedDate && <> &nbsp;·&nbsp; <b>Duyệt lúc:</b> {enroll.approvedDate}</>}
                        </div>
                      )}
                      {c.history?.length > 0 && (
                        <div style={{marginTop:12, paddingTop:10, borderTop:'1px dashed #cbd5e1'}}>
                          <p style={{margin:'0 0 8px', fontWeight:700, color:'#1e293b', fontSize:13}}>
                            📈 Lịch sử thi ({c.history.length} lần):
                          </p>
                          {c.history.map((h,i) => (
                            <div key={i} style={{display:'flex', justifyContent:'space-between',
                              fontSize:13, padding:'5px 0', borderBottom:'1px solid #f1f5f9', color:'#475569'}}>
                              <span>Lần {i+1} — {h.date}</span>
                              <span style={{fontWeight:700, color:h.score>=5?'#059669':'#dc2626'}}>
                                {h.score.toFixed(1)}/10 — {h.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {payModal && (
        <PaymentModal
          cls={payModal}
          user={user}
          onClose={() => setPayModal(null)}
          onConfirm={(code) => confirmPayment(payModal, code)}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   TEACHER VIEW
═══════════════════════════════════════════════════════ */
const TeacherView = ({ user, onLogout }) => {
  const [tab, setTab]             = useState('approve'); // 'approve' | 'classes' | 'students' | 'grades'
  const [classes, setClasses]     = useState(() => JSON.parse(localStorage.getItem('centerClassesDB'))  || initialClasses);
  const [students, setStudents]   = useState(() => JSON.parse(localStorage.getItem('centerStudentsDB')) || initialStudents);
  const [grades, setGrades]       = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [clsName,    setClsName]     = useState('');
  const [clsLecturer,setClsLecturer] = useState('');
  const [editClsId,  setEditClsId]   = useState(null);
  const [stdName,    setStdName]     = useState('');
  const [stdPhone,   setStdPhone]    = useState('');
  const [editStdId,  setEditStdId]   = useState(null);

  const refreshAll = () => {
    setGrades(JSON.parse(localStorage.getItem('examResultsDB')) || []);
    setEnrollments(getEnrollments());
  };
  useEffect(() => { refreshAll(); }, []);

  const pendingCount = enrollments.filter(e => e.status === 'Chờ duyệt').length;

  /* ── Duyệt / Từ chối ── */
  const handleApprove = (id) => {
    const all = getEnrollments().map(e =>
      e.id === id ? {...e, status:'Đã duyệt', approvedDate: new Date().toLocaleString('vi-VN')} : e
    );
    saveEnrollments(all);
    setEnrollments(all);
  };
  const handleReject = (id) => {
    const all = getEnrollments().map(e =>
      e.id === id ? {...e, status:'Từ chối', approvedDate: new Date().toLocaleString('vi-VN')} : e
    );
    saveEnrollments(all);
    setEnrollments(all);
  };

  const saveClass = (e) => {
    e.preventDefault();
    if (!clsName.trim()) return;
    const up = editClsId
      ? classes.map(c => c.id===editClsId ? {...c, name:clsName, lecturer:clsLecturer} : c)
      : [...classes, {id:Date.now(), name:clsName, lecturer:clsLecturer||'Chưa phân công', examDate:'2026-08-01', syllabus:[]}];
    setClasses(up); localStorage.setItem('centerClassesDB', JSON.stringify(up));
    setClsName(''); setClsLecturer(''); setEditClsId(null);
  };

  const saveStudent = (e) => {
    e.preventDefault();
    if (!stdName.trim()) return;
    const up = editStdId
      ? students.map(s => s.id===editStdId ? {...s, fullName:stdName, phone:stdPhone} : s)
      : [...students, {id:Date.now(), fullName:stdName, phone:stdPhone||'Chưa có', email:'student@fit.edu.vn'}];
    setStudents(up); localStorage.setItem('centerStudentsDB', JSON.stringify(up));
    setStdName(''); setStdPhone(''); setEditStdId(null);
  };

  /* Tab button helper */
  const TabBtn = ({id, label, icon}) => (
    <button onClick={() => setTab(id)} style={{
      padding:'10px 16px', border:'none', borderRadius:8, cursor:'pointer',
      fontFamily:'inherit', fontWeight:600, fontSize:13, position:'relative',
      transition:'all .2s',
      background: tab===id ? '#0284c7' : '#f1f5f9',
      color:       tab===id ? '#fff'    : '#64748b',
      boxShadow:   tab===id ? '0 4px 12px rgba(2,132,199,.3)' : 'none',
      display:'inline-flex', alignItems:'center', gap:6
    }}>
      {icon} {label}
      {id==='approve' && pendingCount > 0 && (
        <span style={{background:'#dc2626', color:'#fff', borderRadius:20, fontSize:10,
          fontWeight:800, padding:'1px 6px', marginLeft:4}}>
          {pendingCount}
        </span>
      )}
    </button>
  );

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', padding:'28px 32px'}}>
      {/* Header */}
      <div className="fit-page-header fit-fadeup"
        style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontSize:10, letterSpacing:3, opacity:.75, marginBottom:4}}>HỆ THỐNG QUẢN TRỊ</div>
          <div style={{fontSize:18, fontWeight:700, textTransform:'none', letterSpacing:.3}}>
            Đào tạo & Khảo thí — FIT CENTER
          </div>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <span style={{fontSize:13, color:'#bae6fd'}}>
            Tài khoản: <b style={{color:'#fff'}}>{user.fullName}</b>
          </span>
          <button className="fit-btn-primary"
            style={{background:'rgba(255,255,255,.18)', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,.25)'}}
            onClick={refreshAll}><RefreshCw size={14}/> Làm mới</button>
          <button className="fit-btn-danger" onClick={onLogout}><LogOut size={14}/> Thoát</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{display:'flex', gap:10, marginBottom:24, flexWrap:'wrap'}}>
        <TabBtn id="approve"  label="Duyệt đăng ký"     icon={<Bell size={15}/>}/>
        <TabBtn id="classes"  label="Quản lý lớp học"    icon={<ClipboardList size={15}/>}/>
        <TabBtn id="students" label="Danh sách sinh viên" icon={<User size={15}/>}/>
        <TabBtn id="grades"   label="Bảng điểm"          icon={<BarChart2 size={15}/>}/>
      </div>

      {/* ─── TAB: DUYỆT ĐĂNG KÝ ─── */}
      {tab === 'approve' && (
        <div className="fit-card fit-fadeup" style={{padding:0, overflow:'hidden'}}>
          <div style={{padding:'16px 20px', background:'linear-gradient(90deg,#fef3c7,#fff)',
            borderBottom:'2px solid #f59e0b', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <Bell size={17} color="#f59e0b"/>
              <h3 style={{margin:0, color:'#1e293b', fontSize:15, fontWeight:700}}>
                Yêu cầu đăng ký chờ xét duyệt
              </h3>
              {pendingCount > 0 && (
                <span style={{background:'#f59e0b', color:'#fff', borderRadius:20,
                  fontSize:11, fontWeight:800, padding:'2px 8px'}}>{pendingCount} chờ</span>
              )}
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div style={{textAlign:'center', padding:'40px 20px', color:'#94a3b8', fontSize:14}}>
              Chưa có yêu cầu đăng ký nào.
            </div>
          ) : (
            <div style={{overflowX:'auto'}}>
              <table className="fit-table" style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr>
                    <th>Học viên</th>
                    <th>Khóa học đăng ký</th>
                    <th>Học phí</th>
                    <th>Mã chuyển khoản</th>
                    <th>Ngày gửi</th>
                    <th style={{textAlign:'center'}}>Trạng thái</th>
                    <th style={{textAlign:'center'}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(e => (
                    <tr key={e.id} style={{background: e.status==='Chờ duyệt' ? '#fffbeb' : 'transparent'}}>
                      <td style={{fontWeight:600, color:'#1e293b'}}>{e.studentName}</td>
                      <td style={{color:'#475569', maxWidth:200}}>{e.className}</td>
                      <td style={{fontWeight:700, color:'#0284c7'}}>
                        {(e.price||0).toLocaleString('vi-VN')} ₫
                      </td>
                      <td>
                        <span style={{background:'#f1f5f9', padding:'3px 8px', borderRadius:6,
                          fontSize:11, fontFamily:'monospace', fontWeight:600, color:'#475569'}}>
                          {e.payCode}
                        </span>
                      </td>
                      <td style={{color:'#64748b', fontSize:12}}>{e.requestDate}</td>
                      <td style={{textAlign:'center'}}>
                        {e.status === 'Chờ duyệt' && <span className="badge-pending">⏳ Chờ duyệt</span>}
                        {e.status === 'Đã duyệt'  && <span className="badge-pass">✓ Đã duyệt</span>}
                        {e.status === 'Từ chối'   && <span className="badge-fail">✗ Từ chối</span>}
                      </td>
                      <td style={{textAlign:'center'}}>
                        {e.status === 'Chờ duyệt' ? (
                          <div style={{display:'flex', gap:6, justifyContent:'center'}}>
                            <button className="fit-btn-success" style={{padding:'6px 12px', fontSize:12}}
                              onClick={() => handleApprove(e.id)}>
                              <Check size={13}/> Duyệt
                            </button>
                            <button className="fit-btn-danger" style={{padding:'6px 12px', fontSize:12}}
                              onClick={() => handleReject(e.id)}>
                              <X size={13}/> Từ chối
                            </button>
                          </div>
                        ) : (
                          <span style={{fontSize:12, color:'#94a3b8'}}>{e.approvedDate}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: QUẢN LÝ LỚP ─── */}
      {tab === 'classes' && (
        <div className="fit-main-grid" style={{display:'grid', gridTemplateColumns:'360px 1fr', gap:20}}>
          <div className="fit-card fit-card-accent fit-fadeup">
            <h3 style={{margin:'0 0 18px', color:'#1e293b', fontSize:15, fontWeight:700}}>
              {editClsId ? '✏️ Chỉnh sửa lớp học' : '➕ Tạo lớp học mới'}
            </h3>
            <form onSubmit={saveClass} style={{display:'flex', flexDirection:'column', gap:14}}>
              <div>
                <label style={{display:'block', fontSize:12, fontWeight:700, color:'#475569',
                  marginBottom:7, textTransform:'uppercase', letterSpacing:.7}}>Tên lớp học phần</label>
                <input className="fit-input" value={clsName} onChange={e => setClsName(e.target.value)}
                  placeholder="Nhập tên lớp..." required/>
              </div>
              <div>
                <label style={{display:'block', fontSize:12, fontWeight:700, color:'#475569',
                  marginBottom:7, textTransform:'uppercase', letterSpacing:.7}}>Giảng viên đứng lớp</label>
                <input className="fit-input" value={clsLecturer} onChange={e => setClsLecturer(e.target.value)}
                  placeholder="Tên giảng viên..."/>
              </div>
              <div style={{display:'flex', gap:10}}>
                <button className="fit-btn-primary" type="submit" style={{flex:1}}>
                  {editClsId ? 'Cập nhật lớp' : 'Xác nhận tạo lớp'}
                </button>
                {editClsId && (
                  <button type="button" className="fit-btn-ghost"
                    onClick={() => {setEditClsId(null); setClsName(''); setClsLecturer('');}}>Hủy</button>
                )}
              </div>
            </form>
          </div>

          <div className="fit-card fit-fadeup" style={{padding:0, overflow:'hidden'}}>
            <div style={{padding:'14px 18px', background:'#f8fafc', borderBottom:'2px solid #0284c7',
              display:'flex', alignItems:'center', gap:8}}>
              <ClipboardList size={16} color="#0284c7"/>
              <h3 style={{margin:0, color:'#1e293b', fontSize:14, fontWeight:700}}>
                Lớp học phần ({classes.length})
              </h3>
            </div>
            <div style={{overflowX:'auto', maxHeight:400}}>
              <table className="fit-table" style={{width:'100%', borderCollapse:'collapse'}}>
                <thead><tr><th>Tên lớp</th><th>Giảng viên</th><th>Ngày thi</th><th style={{textAlign:'center'}}>Sửa/Xóa</th></tr></thead>
                <tbody>
                  {classes.map(c => (
                    <tr key={c.id}>
                      <td style={{fontWeight:600, color:'#1e293b'}}>{c.name}</td>
                      <td style={{color:'#64748b'}}>{c.lecturer}</td>
                      <td style={{color:'#64748b'}}>{c.examDate}</td>
                      <td style={{textAlign:'center'}}>
                        <button className="fit-icon-btn" style={{color:'#0284c7'}}
                          onClick={() => {setEditClsId(c.id); setClsName(c.name); setClsLecturer(c.lecturer);}}>
                          <Edit3 size={14}/>
                        </button>
                        <button className="fit-icon-btn" style={{color:'#dc2626'}}
                          onClick={() => {const up=classes.filter(x=>x.id!==c.id); setClasses(up); localStorage.setItem('centerClassesDB',JSON.stringify(up));}}>
                          <Trash2 size={14}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: SINH VIÊN ─── */}
      {tab === 'students' && (
        <div className="fit-main-grid" style={{display:'grid', gridTemplateColumns:'360px 1fr', gap:20}}>
          <div className="fit-card fit-card-accent fit-fadeup" style={{borderTopColor:'#059669'}}>
            <h3 style={{margin:'0 0 18px', color:'#1e293b', fontSize:15, fontWeight:700}}>
              {editStdId ? '✏️ Cập nhật sinh viên' : '➕ Thêm sinh viên mới'}
            </h3>
            <form onSubmit={saveStudent} style={{display:'flex', flexDirection:'column', gap:14}}>
              <div>
                <label style={{display:'block', fontSize:12, fontWeight:700, color:'#475569',
                  marginBottom:7, textTransform:'uppercase', letterSpacing:.7}}>Họ và tên sinh viên</label>
                <input className="fit-input" value={stdName} onChange={e => setStdName(e.target.value)}
                  placeholder="Nhập họ tên..." required/>
              </div>
              <div>
                <label style={{display:'block', fontSize:12, fontWeight:700, color:'#475569',
                  marginBottom:7, textTransform:'uppercase', letterSpacing:.7}}>Số điện thoại</label>
                <input className="fit-input" value={stdPhone} onChange={e => setStdPhone(e.target.value)}
                  placeholder="Số điện thoại..."/>
              </div>
              <div style={{display:'flex', gap:10}}>
                <button className="fit-btn-success" type="submit" style={{flex:1}}>
                  {editStdId ? 'Cập nhật thông tin' : 'Thêm vào danh sách'}
                </button>
                {editStdId && (
                  <button type="button" className="fit-btn-ghost"
                    onClick={() => {setEditStdId(null); setStdName(''); setStdPhone('');}}>Hủy</button>
                )}
              </div>
            </form>
          </div>

          <div className="fit-card fit-fadeup" style={{padding:0, overflow:'hidden'}}>
            <div style={{padding:'14px 18px', background:'#f8fafc', borderBottom:'2px solid #059669',
              display:'flex', alignItems:'center', gap:8}}>
              <User size={16} color="#059669"/>
              <h3 style={{margin:0, color:'#1e293b', fontSize:14, fontWeight:700}}>
                Sinh viên ({students.length})
              </h3>
            </div>
            <div style={{overflowX:'auto', maxHeight:400}}>
              <table className="fit-table" style={{width:'100%', borderCollapse:'collapse'}}>
                <thead><tr><th>Họ và Tên</th><th>SĐT</th><th style={{textAlign:'center'}}>Sửa/Xóa</th></tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td style={{fontWeight:600, color:'#1e293b'}}>{s.fullName}</td>
                      <td style={{color:'#64748b'}}>{s.phone}</td>
                      <td style={{textAlign:'center'}}>
                        <button className="fit-icon-btn" style={{color:'#059669'}}
                          onClick={() => {setEditStdId(s.id); setStdName(s.fullName); setStdPhone(s.phone);}}>
                          <Edit3 size={14}/>
                        </button>
                        <button className="fit-icon-btn" style={{color:'#dc2626'}}
                          onClick={() => {const up=students.filter(x=>x.id!==s.id); setStudents(up); localStorage.setItem('centerStudentsDB',JSON.stringify(up));}}>
                          <Trash2 size={14}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: BẢNG ĐIỂM ─── */}
      {tab === 'grades' && (
        <div className="fit-card fit-fadeup" style={{padding:0, overflow:'hidden'}}>
          <div style={{padding:'14px 18px', background:'#f8fafc', borderBottom:'2px solid #f59e0b',
            display:'flex', alignItems:'center', gap:8}}>
            <BarChart2 size={16} color="#f59e0b"/>
            <h3 style={{margin:0, color:'#1e293b', fontSize:14, fontWeight:700}}>
              Bảng điểm toàn hệ thống ({grades.length} lượt thi)
            </h3>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="fit-table" style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr><th>Học viên</th><th>Khóa học</th><th>Điểm</th><th>Trạng thái</th><th>Ngày thi</th></tr>
              </thead>
              <tbody>
                {grades.length === 0 ? (
                  <tr><td colSpan={5} style={{textAlign:'center', color:'#94a3b8', padding:24, fontSize:13}}>
                    Chưa có bài nộp nào.
                  </td></tr>
                ) : grades.map((g,i) => (
                  <tr key={i}>
                    <td style={{fontWeight:600, color:'#1e293b'}}>{g.studentName}</td>
                    <td style={{color:'#64748b', fontSize:12}}>{g.className}</td>
                    <td><span className={g.score>=5?'badge-pass':'badge-fail'}>{g.score.toFixed(1)}</span></td>
                    <td><span className={g.score>=5?'badge-pass':'badge-fail'}>{g.status}</span></td>
                    <td style={{color:'#64748b', fontSize:12}}>{g.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const login  = (u) => { localStorage.setItem('user', JSON.stringify(u)); setUser(u); };
  const logout = ()  => { localStorage.removeItem('user'); setUser(null); };

  return (
    <Router>
      <GlobalStyles/>
      <Routes>
        <Route path="/login"
          element={user ? <Navigate to={user.role==='Teacher'?'/teacher':'/dashboard'}/> : <LoginPage onLogin={login}/>}/>
        <Route path="/dashboard"
          element={user?.role==='Student' ? <StudentDashboard user={user} onLogout={logout}/> : <Navigate to="/login"/>}/>
        <Route path="/teacher"
          element={user?.role==='Teacher' ? <TeacherView user={user} onLogout={logout}/> : <Navigate to="/login"/>}/>
        <Route path="*" element={<Navigate to="/login"/>}/>
      </Routes>
    </Router>
  );
}
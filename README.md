# Blender Dice Viewer

Website cho phép xem và tương tác với mô hình xúc xắc đỏ (gradient glass) được xuất từ Blender thông qua Three.js.

## Kiến trúc & Cấu trúc thư mục

```
blender-model-website-using-mcp/
├── index.html          # Khung HTML, mount điểm viewer (#viewer)
├── styles.css          # Toàn bộ layout + overlay loading/error
├── main.js             # Thiết lập Three.js, OrbitControls, GLTFLoader
├── redDice.gltf        # File mô hình chính (tham chiếu tới .bin)
├── redDice.bin         # Dữ liệu nhị phân của mô hình
├── package.json        # Scripts + dependencies (vite, three)
├── package-lock.json   # Lockfile npm
├── vite.config.js      # Config server/build (port 5173, open browser)
└── node_modules/       # (tự sinh sau khi npm install)
```

Luồng hoạt động:
1. `index.html` render layout + nhúng `main.js`.
2. `main.js` khởi tạo renderer, camera, ánh sáng, OrbitControls.
3. `GLTFLoader` tải `redDice.gltf` (tự tìm `redDice.bin` nhờ `setResourcePath`).
4. Người dùng kéo/zoom trong canvas để xem mô hình.

## Yêu cầu
- Node.js >= 18
- NPM >= 9

## Cài đặt

```bash
npm install
```

## Chạy dev server

```bash
npm start
```

Vite sẽ chạy tại `http://localhost:5173` và tự mở trình duyệt. Nếu không tự mở, hãy vào đường dẫn trên thủ công.

## Build production

```bash
npm run build   # xuất ra thư mục dist/
npm run preview # chạy thử bản build
```

## Troubleshooting
- **Không thấy model**: mở DevTools Console xem log. Đảm bảo `redDice.gltf/redDice.bin` ở thư mục gốc.
- **Không xoay được**: kiểm tra xem `<div id="viewer">` có render chưa, đảm bảo không chồng phần tử khác.
- **Muốn đổi model**: thay cặp `.gltf/.bin` mới và cập nhật đường dẫn trong `main.js` nếu cần.

## Ghi chú thêm
- Three.js & add-ons import từ package npm (`three`).
- Renderer bật `physicallyCorrectLights`, `RoomEnvironment` để mô phỏng studio light.
- OrbitControls bị giới hạn pan, chỉ cho xoay/zoom để giữ trải nghiệm xem sản phẩm.

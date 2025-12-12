# 502 Bad Gateway - Troubleshooting Guide

## Vấn đề
Request đến `/api/campaigns/metadata` bị lỗi **502 Bad Gateway**.

## Nguyên nhân
Nginx không kết nối được đến backend API vì `VITE_API_BASE_URL` sai hoặc backend không accessible từ container.

---

## ✅ Giải pháp

### Bước 1: Kiểm tra backend có chạy không

**Trên VPS, kiểm tra backend:**
```bash
# Nếu backend chạy trên port 3000
curl http://localhost:3000/campaigns/metadata?page=1&limit=6

# Hoặc kiểm tra container backend
docker ps | grep backend
docker logs your-backend-container
```

### Bước 2: Kiểm tra `VITE_API_BASE_URL` trong container

```bash
# Xem env variable trong container
docker exec crowdfunding-fe env | grep VITE_API_BASE_URL

# Xem nginx config đã được substitute chưa
docker exec crowdfunding-fe cat /etc/nginx/conf.d/default.conf | grep proxy_pass
```

**Kết quả mong đợi:**
```nginx
proxy_pass http://your-backend-url:3000;  # ✅ URL đã được thay thế
```

**KHÔNG phải:**
```nginx
proxy_pass ${VITE_API_BASE_URL};  # ❌ Biến chưa được substitute
```

### Bước 3: Fix file `.env.fe` trên VPS

**Sửa file:**
```bash
vim /home/fink/Workspace/crowdfunding/env/.env.fe
```

**Chọn đúng URL dựa vào setup của bạn:**

#### Option 1: Backend chạy trong Docker container (KHUYẾN NGHỊ)
```bash
# 1. Tạo Docker network chung
docker network create crowdfunding-network

# 2. Thêm backend vào network này
docker network connect crowdfunding-network your-backend-container

# 3. Set .env.fe
VITE_API_BASE_URL=http://your-backend-container-name:3000
DOCKER_NETWORK=crowdfunding-network
```

#### Option 2: Backend chạy trực tiếp trên VPS (không Docker)
```bash
# Dùng IP của host machine (không dùng localhost!)
VITE_API_BASE_URL=http://192.168.1.100:3000
# Hoặc
VITE_API_BASE_URL=http://$(hostname -I | awk '{print $1}'):3000
```

#### Option 3: Backend ở server khác
```bash
VITE_API_BASE_URL=http://api.yourdomain.com
# Hoặc dùng IP
VITE_API_BASE_URL=http://123.45.67.89:3000
```

### Bước 4: Redeploy

Sau khi sửa `.env.fe`, chạy lại deploy script:

```bash
cd /home/fink/Workspace/crowdfunding/deploy_scripts
./deploy_fe.sh
```

Script sẽ tự động:
- Load biến từ `.env.fe`
- Recreate container với config mới
- Kiểm tra và hiển thị nginx config

---

## 🔍 Debug Commands

### Test kết nối TỪ TRONG container:

```bash
# Install curl trong container
docker exec crowdfunding-fe sh -c 'apk add --no-cache curl'

# Test kết nối đến backend
docker exec crowdfunding-fe curl -v $VITE_API_BASE_URL/campaigns/metadata?page=1&limit=6
```

### Xem nginx error logs:

```bash
docker logs crowdfunding-fe 2>&1 | grep error
```

### Restart container với config mới:

```bash
docker stop crowdfunding-fe
docker rm crowdfunding-fe

# Set biến và chạy lại
export VITE_API_BASE_URL="http://your-backend:3000"
docker run -d \
  --name crowdfunding-fe \
  --network crowdfunding-network \
  -e VITE_API_BASE_URL="$VITE_API_BASE_URL" \
  -p 8386:8386 \
  phantansy/crowdfunding-fe:latest
```

---

## 📝 Checklist

- [ ] Backend đang chạy và accessible
- [ ] `.env.fe` có `VITE_API_BASE_URL` đúng
- [ ] Nếu dùng Docker network, cả 2 container đều trong cùng network
- [ ] URL trong nginx config đã được substitute (không còn `${...}`)
- [ ] Test curl từ trong container thành công

---

## 💡 Lưu ý

**ĐỪNG dùng `localhost` trong `VITE_API_BASE_URL`!**

❌ Sai:
```bash
VITE_API_BASE_URL=http://localhost:3000  # localhost trong container là chính container đó!
```

✅ Đúng:
```bash
# Dùng container name (nếu cùng network)
VITE_API_BASE_URL=http://backend-container:3000

# Hoặc dùng IP thực của host
VITE_API_BASE_URL=http://192.168.1.100:3000
```

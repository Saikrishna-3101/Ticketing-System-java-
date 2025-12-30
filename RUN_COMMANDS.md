# 🚀 Run Commands - Ticketing System

## ⚡ Quick Copy-Paste Commands

### Prerequisites
1. Make sure PostgreSQL is running
2. Database `ticketing_system` exists (created automatically or create manually)

---

## 📦 BACKEND - Run These Commands

### Option 1: Using Maven Wrapper (Recommended - No Maven Installation Needed)

**Open PowerShell/Terminal and run:**

```powershell
# Navigate to Backend folder
cd "D:\Leap Scholar\Backend"

# Run the Spring Boot application (Maven Wrapper will download Maven automatically)
.\mvnw.cmd spring-boot:run
```

**Or use the batch file:**
```powershell
# From project root
.\RUN_BACKEND.bat
```

### Option 2: Using Maven (If Maven is installed globally)

```powershell
cd "D:\Leap Scholar\Backend"
mvn clean install
mvn spring-boot:run
```

**✅ Success:** You'll see:
```
Started TicketingSystemApplication in X.XXX seconds
Default admin user created: username=admin, password=admin123
```

**Backend runs on:** http://localhost:8080

---

## 🎨 FRONTEND - Run These Commands

**Open a NEW PowerShell/Terminal window and run:**

```powershell
# Navigate to Frontend folder
cd "D:\Leap Scholar\Frontend"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

**Or in one line:**
```powershell
cd "D:\Leap Scholar\Frontend"; npm install; npm run dev
```

**✅ Success:** You'll see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Frontend runs on:** http://localhost:3000

---

## 🎯 Complete Setup (First Time Only)

### Backend Setup:
```powershell
cd "D:\Leap Scholar\Backend"
mvn clean install
mvn spring-boot:run
```

### Frontend Setup (in new terminal):
```powershell
cd "D:\Leap Scholar\Frontend"
npm install
npm run dev
```

---

## 🔄 Daily Usage (After First Setup)

### Backend:
```powershell
cd "D:\Leap Scholar\Backend"
mvn spring-boot:run
```

### Frontend:
```powershell
cd "D:\Leap Scholar\Frontend"
npm run dev
```

---

## 🛑 Stop Commands

**To stop Backend:**
- Press `Ctrl + C` in the backend terminal

**To stop Frontend:**
- Press `Ctrl + C` in the frontend terminal

---

## 📝 Notes

1. **Keep both terminals open** - Backend and Frontend must run simultaneously
2. **Backend must start first** - Wait for "Started TicketingSystemApplication" before starting frontend
3. **First time setup** - `mvn clean install` and `npm install` only needed once
4. **Database** - Make sure PostgreSQL is running and database exists

---

## 🐛 Troubleshooting

### If Maven command not found:
```powershell
# Check if Maven is installed
mvn --version
```

### If npm command not found:
```powershell
# Check if Node.js is installed
node --version
npm --version
```

### If port 8080 is busy (Backend):
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

### If port 3000 is busy (Frontend):
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

## ✅ Verify It's Working

1. **Backend:** Open http://localhost:8080 (should show error page = backend is running)
2. **Frontend:** Open http://localhost:3000 (should show login page)

---

**That's it! Copy and paste these commands! 🚀**


# Quick Setup Guide

## Prerequisites Checklist

- [ ] Java 17+ installed
- [ ] Maven 3.6+ installed
- [ ] PostgreSQL 12+ installed and running
- [ ] Node.js 18+ and npm installed

## Step-by-Step Setup

### 1. Database Setup (5 minutes)

1. **Start PostgreSQL service**
   ```bash
   # Windows (if installed as service, it should auto-start)
   # Or use pgAdmin to start
   
   # Linux/Mac
   sudo systemctl start postgresql
   # or
   brew services start postgresql
   ```

2. **Create database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE ticketing_system;
   
   # Exit
   \q
   ```

### 2. Backend Setup (10 minutes)

1. **Navigate to backend**
   ```bash
   cd Backend
   ```

2. **Configure database** (edit `src/main/resources/application.properties`)
   - Update `spring.datasource.username` if not `postgres`
   - Update `spring.datasource.password` with your PostgreSQL password
   - Update `jwt.secret` with a secure random string (optional but recommended)

3. **Build and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Verify backend is running**
   - Open browser: `http://localhost:8080`
   - You should see a Whitelabel Error Page (this is normal - means server is running)
   - Check console for: "Default admin user created: username=admin, password=admin123"

### 3. Frontend Setup (5 minutes)

1. **Navigate to frontend** (in a new terminal)
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Verify frontend is running**
   - Open browser: `http://localhost:3000`
   - You should see the login page

### 4. First Login

Use the default credentials created by DataInitializer:

- **Admin**: username=`admin`, password=`admin123`
- **Support Agent**: username=`agent`, password=`agent123`
- **Regular User**: username=`user`, password=`user123`

> ⚠️ **Important**: Change these passwords in production!

## Troubleshooting

### Backend won't start

1. **Check PostgreSQL is running**
   ```bash
   # Windows
   services.msc  # Look for PostgreSQL service
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Check database connection**
   - Verify database name, username, password in `application.properties`
   - Test connection: `psql -U postgres -d ticketing_system`

3. **Check port 8080 is available**
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Linux/Mac
   lsof -i :8080
   ```

### Frontend won't connect to backend

1. **Check backend is running** on `http://localhost:8080`
2. **Check CORS settings** in `application.properties`
3. **Check API URL** in `Frontend/src/lib/api.ts` or `.env` file

### Database errors

1. **Check Hibernate DDL mode** - should be `update` for auto-creation
2. **Check PostgreSQL logs** for connection issues
3. **Verify database exists**: `\l` in psql

## Next Steps

1. ✅ Login with admin account
2. ✅ Create a test ticket
3. ✅ Explore admin panel
4. ✅ Test different user roles
5. ✅ Configure email (optional) for notifications

## Production Deployment Notes

Before deploying to production:

1. **Change default passwords** - Update DataInitializer or remove it
2. **Set strong JWT secret** - Use a secure random string
3. **Configure proper email SMTP** - For notifications
4. **Set `spring.jpa.hibernate.ddl-auto=validate`** - Don't auto-update schema
5. **Use environment variables** - Don't hardcode credentials
6. **Enable HTTPS** - For secure communication
7. **Configure proper CORS** - Only allow your frontend domain

## Support

If you encounter issues:

1. Check the README.md for detailed documentation
2. Review application logs in the console
3. Verify all prerequisites are installed correctly
4. Check database connection and permissions

---

**Happy Coding! 🚀**




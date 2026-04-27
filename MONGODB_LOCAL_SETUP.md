# MongoDB Local Setup Guide

This guide will help you install and setup MongoDB locally for development.

---

## 🖥️ INSTALLATION STEPS

### **Option 1: macOS (Recommended)**

#### Step 1: Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Step 3: Start MongoDB Service
```bash
# Start MongoDB as a service
brew services start mongodb-community

# Or run MongoDB in the foreground
mongod
```

#### Step 4: Verify Installation
```bash
mongo --version
```

---

### **Option 2: Windows**

#### Step 1: Download MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select "Windows" as the OS
3. Download the MSI installer

#### Step 2: Run Installer
1. Double-click the downloaded MSI file
2. Follow the installation wizard
3. Choose "Install MongoDB as a Service" (recommended)
4. Complete the installation

#### Step 3: Start MongoDB
```bash
# MongoDB should start automatically as a service
# Or manually start it:
net start MongoDB
```

#### Step 4: Verify Installation
```bash
mongo --version
```

---

### **Option 3: Ubuntu/Linux**

#### Step 1: Import MongoDB GPG Key
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
```

#### Step 2: Add MongoDB Repository
```bash
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

#### Step 3: Update Package List
```bash
sudo apt-get update
```

#### Step 4: Install MongoDB
```bash
sudo apt-get install -y mongodb-org
```

#### Step 5: Start MongoDB Service
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 6: Verify Installation
```bash
mongo --version
```

---

### **Option 4: Docker (Easiest)**

#### Step 1: Install Docker
- Download from https://www.docker.com/products/docker-desktop

#### Step 2: Run MongoDB Container
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

#### Step 3: Verify Container is Running
```bash
docker ps
```

#### Step 4: Connect to MongoDB
```bash
mongo mongodb://admin:password@localhost:27017/
```

---

## ✅ VERIFY MONGODB IS RUNNING

### **Check if MongoDB is Running**

#### macOS/Linux:
```bash
# Check if mongod process is running
ps aux | grep mongod

# Or check the service status
brew services list  # macOS
sudo systemctl status mongod  # Linux
```

#### Windows:
```bash
# Check if MongoDB service is running
Get-Service MongoDB
```

#### Docker:
```bash
docker ps | grep mongodb
```

---

## 🔌 CONNECT TO MONGODB

### **Using MongoDB Shell**

#### Connect to Local MongoDB
```bash
# Without authentication
mongo

# With authentication (if you set it up)
mongo mongodb://admin:password@localhost:27017/
```

#### Basic Commands
```bash
# Show all databases
show dbs

# Create/switch to a database
use smart-assistant

# Show all collections
show collections

# Create a collection
db.createCollection("users")

# Insert a document
db.users.insertOne({ name: "John", email: "john@example.com" })

# Find documents
db.users.find()

# Exit
exit
```

---

## 🔧 UPDATE BACKEND .env FILE

### **Update MongoDB Connection String**

Edit `backend/.env`:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/smart-assistant
MONGODB_USER=
MONGODB_PASSWORD=

# If you set up authentication:
MONGODB_URI=mongodb://admin:password@localhost:27017/smart-assistant
MONGODB_USER=admin
MONGODB_PASSWORD=password
```

---

## 📊 CREATE INITIAL DATABASE

### **Step 1: Connect to MongoDB**
```bash
mongo
```

### **Step 2: Create Database and Collections**
```javascript
// Switch to smart-assistant database
use smart-assistant

// Create users collection
db.createCollection("users")

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ googleId: 1 }, { sparse: true })
db.users.createIndex({ facebookId: 1 }, { sparse: true })

// Create other collections
db.createCollection("elders")
db.createCollection("caregivers")
db.createCollection("volunteers")
db.createCollection("sos")

// Verify collections
show collections
```

### **Step 3: Exit MongoDB Shell**
```bash
exit
```

---

## 🧪 TEST CONNECTION FROM BACKEND

### **Step 1: Start Backend Server**
```bash
cd backend
npm run dev
```

### **Step 2: Check Console Output**
You should see:
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

### **Step 3: Test API Endpoint**
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-04-27T..."
}
```

---

## 🛠️ MONGODB TOOLS

### **MongoDB Compass (GUI)**

#### Installation
1. Download from https://www.mongodb.com/products/compass
2. Install and launch
3. Connect to `mongodb://localhost:27017/`

#### Features
- Visual database management
- Query builder
- Data visualization
- Performance monitoring

### **MongoDB Atlas (Cloud Alternative)**

If you prefer cloud MongoDB:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env` with connection string

---

## 🐛 TROUBLESHOOTING

### **Problem: "Connection refused"**

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
net start MongoDB  # Windows
docker start mongodb  # Docker
```

### **Problem: "Port 27017 already in use"**

**Solution:**
```bash
# Find process using port 27017
lsof -i :27017  # macOS/Linux
netstat -ano | findstr :27017  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### **Problem: "Authentication failed"**

**Solution:**
```bash
# Connect without authentication
mongo

# Or check credentials in .env file
# Make sure MONGODB_USER and MONGODB_PASSWORD are correct
```

### **Problem: "Database not found"**

**Solution:**
```bash
# MongoDB creates database on first write
# Just connect and insert a document:
mongo
use smart-assistant
db.users.insertOne({ test: true })
```

---

## 📋 QUICK REFERENCE

### **Start/Stop MongoDB**

#### macOS
```bash
# Start
brew services start mongodb-community

# Stop
brew services stop mongodb-community

# Restart
brew services restart mongodb-community
```

#### Linux
```bash
# Start
sudo systemctl start mongod

# Stop
sudo systemctl stop mongod

# Restart
sudo systemctl restart mongod

# Status
sudo systemctl status mongod
```

#### Windows
```bash
# Start
net start MongoDB

# Stop
net stop MongoDB
```

#### Docker
```bash
# Start
docker start mongodb

# Stop
docker stop mongodb

# Restart
docker restart mongodb
```

---

## 🔐 SECURITY BEST PRACTICES

### **For Development (Local)**
- No authentication needed
- Use default port 27017
- Keep data in local directory

### **For Production**
- Enable authentication
- Use strong passwords
- Change default port
- Enable encryption
- Use MongoDB Atlas or managed service
- Regular backups

---

## 📊 VERIFY SETUP

### **Checklist**
```
✅ MongoDB installed
✅ MongoDB service running
✅ Can connect with mongo shell
✅ smart-assistant database created
✅ Collections created
✅ Backend .env updated
✅ Backend can connect to MongoDB
✅ Health check endpoint working
```

---

## 🚀 NEXT STEPS

1. **Install MongoDB** using one of the options above
2. **Start MongoDB service**
3. **Create database and collections**
4. **Update backend .env**
5. **Start backend server**
6. **Test connection**
7. **Run API tests**

---

## 📞 SUPPORT

If you encounter issues:

1. Check MongoDB logs:
   ```bash
   # macOS
   tail -f /usr/local/var/log/mongodb/mongo.log
   
   # Linux
   sudo tail -f /var/log/mongodb/mongod.log
   ```

2. Check backend logs:
   ```bash
   cd backend
   npm run dev
   ```

3. Verify MongoDB is listening:
   ```bash
   netstat -an | grep 27017
   ```

4. Test connection:
   ```bash
   mongo mongodb://localhost:27017/
   ```

---

**Last Updated:** April 2025
**Version:** 1.0

# Leap Scholar Ticketing System

A modern web-based ticketing system for managing customer support requests with role-based access control.

## 🚀 Features

- **User Management**: Role-based authentication (Admin, Support Agent, Customer)
- **Ticket Management**: Create, view, update, and search tickets
- **Status Tracking**: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- **Priority Levels**: LOW, MEDIUM, HIGH, URGENT
- **Comment System**: Add comments to tickets for collaboration
- **Real-time Updates**: Dynamic status updates and filtering
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠 Tech Stack

### Backend
- **Java 17** with Spring Boot
- **Spring Security** for authentication
- **Spring Data JPA** for data persistence
- **H2 Database** (in-memory)
- **Maven** for dependency management

### Frontend
- **Next.js 14** with TypeScript
- **React** for UI components
- **Tailwind CSS** for styling
- **Axios** for HTTP requests

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- npm or yarn

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Run the Spring Boot application:
```bash
./mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8081`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
Leap Scholar/
├── Backend/
│   ├── src/main/java/com/leapscholar/ticketing/
│   │   ├── controller/     # REST API endpoints
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access layer
│   │   ├── model/          # Entity classes
│   │   └── dto/            # Data transfer objects
│   └── pom.xml             # Maven configuration
├── Frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # Reusable components
│   │   └── context/        # React context providers
│   └── package.json        # Node.js dependencies
└── README.md               # This file
```

## 🔐 Authentication

The system uses JWT-based authentication with the following roles:

- **ADMIN**: Full system access, can manage all tickets and users
- **SUPPORT_AGENT**: Can view and manage assigned tickets
- **CUSTOMER**: Can create and view their own tickets

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tickets
- `GET /api/tickets` - Get all tickets (with filters)
- `GET /api/tickets/{id}` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PATCH /api/tickets/{id}/status` - Update ticket status
- `PUT /api/tickets/{id}` - Update ticket details

### Comments
- `GET /api/tickets/{id}/comments` - Get ticket comments
- `POST /api/tickets/{id}/comments` - Add comment to ticket

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Ticket**: Submit a new support ticket with subject and description
3. **View Dashboard**: See all tickets with filtering options
4. **Manage Tickets**: Update status, add comments, assign to agents
5. **Search**: Filter tickets by status, priority, or search terms

## 🔧 Configuration

### Database
The application uses an in-memory H2 database that resets on restart. For production, configure a persistent database in `application.properties`.

### Port Configuration
- Backend: `8081` (configurable in `application.properties`)
- Frontend: `3000` (configurable in `package.json`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository.

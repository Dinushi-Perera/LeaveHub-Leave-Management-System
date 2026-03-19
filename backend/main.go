package main

import (
	"leave-management-api/database"
	"leave-management-api/handlers"
	"leave-management-api/middleware"
	"leave-management-api/utils"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Note: .env file not found, using environment variables")
	}

	// Set JWT secret from environment
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret != "" {
		utils.JWTSecret = []byte(jwtSecret)
	}

	// Initialize database
	database.InitDB()
	defer database.Close()

	// Create router
	router := gin.Default()

	// Apply middleware
	router.Use(middleware.CORSMiddleware())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "OK"})
	})

	// Public routes
	public := router.Group("/api")
	{
		public.POST("/login", handlers.Login)
	}

	// Protected routes
	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// Auth
		protected.GET("/me", handlers.GetMe)

		// User profile
		protected.GET("/profile", handlers.GetProfile)
		protected.PUT("/profile", handlers.UpdateProfile)
		protected.GET("/users", handlers.GetAllUsers)

		// Leave management
		protected.POST("/leaves/apply", handlers.ApplyLeave)
		protected.GET("/leaves/my", handlers.GetMyLeaves)
		protected.GET("/leaves/all", handlers.GetAllLeaves)

		// Dashboard
		protected.GET("/dashboard/employee", handlers.GetEmployeeDashboard)
		protected.GET("/dashboard/manager", handlers.GetManagerDashboard)
		protected.GET("/dashboard/today-status", handlers.GetTodayStatus)

		// Manager only routes
		manager := protected.Group("")
		manager.Use(middleware.ManagerOnly())
		{
			manager.PUT("/leaves/:id/approve", handlers.ApproveLeave)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	router.Run(":" + port)
}

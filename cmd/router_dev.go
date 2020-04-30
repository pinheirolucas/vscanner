// +build !dist

package cmd

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func getRouter(noui bool) *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())
	return r
}

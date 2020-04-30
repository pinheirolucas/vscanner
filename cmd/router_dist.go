// +build dist

package cmd

import "github.com/gin-gonic/gin"

func getRouter(noui bool) {
	return gin.Default()
}

package cmd

import (
	"image"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-vgo/robotgo"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"gopkg.in/bieber/barcode.v0"
)

var serveCmd = &cobra.Command{
	Use:     "serve",
	Short:   "A brief description of your command",
	Aliases: []string{"server", "s", "init", "run"},
	RunE:    runServeCmd,
}

func runServeCmd(cmd *cobra.Command, args []string) error {
	rawAddresses := viper.GetStringSlice("addresses")

	var addresses []string
	for _, address := range rawAddresses {
		if strings.TrimSpace(address) == "" {
			continue
		}

		addresses = append(addresses, address)
	}

	if len(addresses) == 0 {
		return errors.New("address not provided")
	}

	noui := viper.GetBool("noui")

	r := getRouter(noui)

	r.POST("/scan", scan)

	return r.Run(addresses...)
}

func init() {
	serveCmd.Flags().StringSliceP("address", "a", []string{":6339"}, "the addresses to bind the http server")
	viper.BindPFlag("addresses", serveCmd.Flags().Lookup("address"))

	serveCmd.Flags().Bool("noui", false, "initialize the http server with no ui")
	viper.BindPFlag("noui", serveCmd.Flags().Lookup("noui"))

	rootCmd.AddCommand(serveCmd)
}

func scan(c *gin.Context) {
	startDelayStr := c.DefaultPostForm("startDelay", "5")
	typingDelayStr := c.DefaultPostForm("typingDelay", "0")

	startDelay, err := strconv.Atoi(startDelayStr)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	typingDelay, err := strconv.Atoi(typingDelayStr)
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	code, err := c.FormFile("code")
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	file, err := code.Open()
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}
	defer file.Close()

	imgSrc, _, err := image.Decode(file)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	img := barcode.NewImage(imgSrc)
	scanner := barcode.NewScanner().SetEnabledAll(true)
	symbols, err := scanner.ScanImage(img)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	time.Sleep(time.Duration(startDelay) * time.Second)
	for _, symbol := range symbols {
		robotgo.TypeStrDelay(symbol.Data, typingDelay)
	}
}

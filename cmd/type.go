package cmd

import (
	"time"

	"github.com/go-vgo/robotgo"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var typeCmd = &cobra.Command{
	Use:     "type",
	Short:   "Start typing the provided string",
	Aliases: []string{"scan"},
	RunE:    runTypeCmd,
}

func runTypeCmd(cmd *cobra.Command, args []string) error {
	if len(args) == 0 {
		return errors.New("no string provided to typing")
	}

	str := args[0]
	startDelay := viper.GetInt("start_typing_delay")
	typingDelay := viper.GetInt("typing_delay")

	time.Sleep(time.Duration(startDelay) * time.Second)
	robotgo.TypeStrDelay(str, typingDelay)

	return nil
}

func init() {
	typeCmd.Flags().IntP("start-delay", "s", 5, "delay in seconds for vscanner to start typing")
	viper.BindPFlag("start_typing_delay", typeCmd.Flags().Lookup("start-delay"))

	typeCmd.Flags().IntP("typing-delay", "d", 0, "delay in seconds between each character typing")
	viper.BindPFlag("typing_delay", typeCmd.Flags().Lookup("typing-delay"))

	rootCmd.AddCommand(typeCmd)
}

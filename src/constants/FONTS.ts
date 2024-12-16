import { useFonts } from "expo-font";

export default function useCustomFonts() {
    const [fontsLoaded] = useFonts({
        Bold: require("../assets/fonts/Poppins-Bold.ttf"),
        Regular: require("../assets/fonts/Poppins-Regular.ttf"),
        SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
        Thin: require("../assets/fonts/Poppins-Thin.ttf"),
        Light: require("../assets/fonts/Poppins-Light.ttf"),
        Medium: require("../assets/fonts/Poppins-Medium.ttf"),
    });

    return fontsLoaded;
}
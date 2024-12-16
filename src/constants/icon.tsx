import { Feather, Ionicons } from "@expo/vector-icons";

export const icon:any = {
    Home : (props : any) => <Feather name="home" size={24}  {...props} />,
    Compte : (props : any) => <Ionicons name="wallet-outline" size={24}  {...props} />,
    Notifications : (props : any) => <Feather name="bell" size={24}  {...props} />,
    Parametre : (props : any) => <Feather name="settings" size={24}  {...props} />
}
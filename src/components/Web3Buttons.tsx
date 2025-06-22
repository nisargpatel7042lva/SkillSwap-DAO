import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useAccount } from "wagmi";
import { useUser } from "@/components/UserContext";
import { Link } from "react-router-dom";


const Web3Buttons = () => {
    const { isConnected } = useAccount();
    const { profile } = useUser();

    return (
        <div className="flex items-center space-x-4">
            <Link to="/profile">
                <Button className="border-2 border-dashed border-transparent hover:border-gray-300 rounded-xl flex items-center gap-2">
                {isConnected && profile?.avatar_url ? (
                    <Avatar className="w-6 h-6">
                    <AvatarImage src={profile.avatar_url} alt={profile.username} />
                    <AvatarFallback className="text-xs">{profile.username?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                ) : (
                    <User className="w-4 h-4" />
                )}
                Profile
                </Button>
            </Link>
            <ConnectButton />
        </div>
    )
}

export default Web3Buttons; 
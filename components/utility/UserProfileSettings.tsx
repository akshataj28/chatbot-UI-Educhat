import { FC, useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  Avatar,
  IconButton,
  InputLabel,
} from "@mui/material";
import { IconEdit } from "@tabler/icons-react"
import Image from "next/image";
import  { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import ImagePicker from "../ui/image-picker";
import { ThemeSwitcher } from "./theme-switcher"; // Assuming you have this component
import { ChatbotUIContext } from "@/context/context";
import { uploadProfileImage } from "@/db/storage/profile-images";
import { updateProfile } from "@/db/profile";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/browser-client";
import { useTheme } from "next-themes";

interface UserProfileSettingsProps {
    profileImageSrc: string;
    onSaveProfileImage: (newImageSrc: string) => void; // Function to update the profile image in Dashboard
    displayName: string;
    onSaveDisplayName: (newDisplayName: string) => void;
  }
  export const UserProfileSettings: FC<UserProfileSettingsProps> = ({
    profileImageSrc,
    onSaveProfileImage,
    displayName,
    onSaveDisplayName,
  }) => {

    const {
        profile,
        setProfile,
        envKeyMap,
        setAvailableHostedModels,
        setAvailableOpenRouterModels,
        availableOpenRouterModels
      } = useContext(ChatbotUIContext)
      const router = useRouter()
      const { theme, setTheme } = useTheme();
      const [email, setEmail] = useState("example@test.com");
//   const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState(true)
  const [loadingUsername, setLoadingUsername] = useState(false)
  
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileInstructions, setProfileInstructions] = useState(
    profile?.profile_context || ""
  )
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isOpen, setIsOpen] = useState(false)

  const [tempProfileImageSrc, setTempProfileImageSrc] = useState<string>(
    profileImageSrc
  );
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false); 


//   const router = useRouter();
const [localDisplayName, setLocalDisplayName] = useState(displayName);

const handleThemeChange = (event: { target: { value: any; }; }) => {
  const selectedTheme = event.target.value; // Convert to lowercase to match your logic
  console.log("ko", selectedTheme)
  if(selectedTheme=="Dark"){
    localStorage.setItem("theme", "dark");  // Save to localStorage

  }
  setTheme(selectedTheme);  // Update the theme
};
    const handleSave = async () => {
        console.log("Saved settings:");
        if (!profile) return
        let profileImageUrl = profile.image_url
        let profileImagePath = ""

        let newProfileImageUrl = tempProfileImageSrc;

    
        if (profileImageFile) {
          const { path, url } = await uploadProfileImage(profile, profileImageFile)
          profileImageUrl = url ?? profileImageUrl
          profileImagePath = path
        }

        onSaveProfileImage(newProfileImageUrl);

    
        const updatedProfile = await updateProfile(profile.id, {
          ...profile,
          display_name: displayName,
          username,
          profile_context: profileInstructions,
          image_url: profileImageUrl,
          image_path: profileImagePath,
         
        }
        )
        onSaveDisplayName(localDisplayName);
        setProfile(updatedProfile)
        toast.success("Profile updated!")
        setIsOpen(false)

};

  const handleEditAvatar = () => {
    setIsEditingAvatar(true); // Show ImagePicker when the edit icon is clicked
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()

    return
  }

  return (
<div
  className={`flex flex-col gap-8 px-[190px] py-[52px] rounded-xl max-w-[100%] ${
    theme === 'dark' ? 'bg-gray-700 text-white' : theme === 'beige' ? 'bg-beige-200 text-black' : 'bg-white text-black'
  }`}
>
      {/* Sign Out Button */}
      <div className="flex justify-end">
        <Button variant="outlined" color="gray" className="bg-gray-100 text-whi" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>

      {/* General Section */}
      <div className=" w-full">
        <h3 className="text-lg font-semibold mb-3 ml-5 text-white" style={{ color: theme === "dark" ? "#FFFF" : "#000000" }}>General</h3>
        <div className="mb-5 gap-[400px] items-center bg-gray-100 p-4 rounded-lg flex pl-9 pr-6" style={{ color: theme === "light" ? "rgb(229 231 235)" : "#000000" }}>
        {/* <InputLabel id="theme-label " >Theme</InputLabel>
          <Select
            labelId="theme-label"
            value={theme}
            onChange={handleThemeChange}
            variant="outlined"
            style={{
              width: '150px',
              backgroundColor: '#FFF',
              borderRadius: '4px',
            }}
          >
            <MenuItem value="Dark">Dark</MenuItem>
            <MenuItem value="Beige">Beige</MenuItem>
            <MenuItem value="Light">Light</MenuItem>
          </Select> */}
          <ThemeSwitcher />
        </div>
      </div>

      {/* Account Section */}
      <div className="w-full">
  <h3 className="text-lg font-semibold mb-3 ml-5 text-white" style={{ color: theme === "dark" ? "#FFFF" : "#000000" }}>Account</h3>

  <div className="mb-5 items-center bg-gray-100 p-4 rounded-lg pl-9 pr-6">
    {/* Avatar and Edit */}
    <div className="flex items-center justify-between mb-5">
      {/* Avatar Label */}
      <div>
        <InputLabel id="theme-label">Avatar</InputLabel>
      </div>
      <div className="flex items-center gap-2">
        {isEditingAvatar ? (
          <ImagePicker
            src={profileImageSrc}
            image={profileImageFile}
            height={50}
            width={50}
            onSrcChange={setTempProfileImageSrc}
            onImageChange={setProfileImageFile}
          />
        ) : (
          <Avatar
            alt="User Avatar"
            src={profileImageSrc || "/default-avatar.png"} // Use a default image if there's no profile image
            className="w-12 h-12"
          />
        )}
        <IconButton onClick={handleEditAvatar}>
          <IconEdit />
        </IconButton>
      </div>
    </div>
    <hr className="border-gray-300"/>
    <br/>
    {/* Display Name Field */}
    <div className="flex items-center justify-between mb-5">
            <InputLabel>Display Name</InputLabel>
            <div className="flex items-center gap-2 text-black">
              {isEditingDisplayName ? (
                <TextField
                  value={localDisplayName}
                  onChange={(e) => setLocalDisplayName(e.target.value)}
                  variant="outlined"
                  size="small"
                  inputProps={{ maxLength: 30 }}
                />
              ) : (
                <span>{localDisplayName}</span>
              )}
              <IconButton onClick={() => setIsEditingDisplayName(!isEditingDisplayName)}>
                <IconEdit />
              </IconButton>
            </div>
          </div>
    {/* Email Field */}
    <hr className="border-gray-300"/>
    <br/>
    <div className="flex items-center justify-between mb-5">
      <InputLabel>Email</InputLabel>
      <span className="text-black">{email}</span>
    </div>
  </div>
</div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="contained"  onClick={handleSave}   style={{ backgroundColor: '#d3d3d3', color: 'black' }}
>
          Save
        </Button>
      </div>
    </div>
  );
};

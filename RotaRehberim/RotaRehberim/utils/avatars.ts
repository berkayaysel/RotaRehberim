const avatars = {
  "backpacker": require("../assets/images/avatars/backpacker.png"),
  "city-explorer": require("../assets/images/avatars/city-explorer.png"),
  "beach-wanderer": require("../assets/images/avatars/beach-wanderer.png"),
  "cultural-traveler": require("../assets/images/avatars/cultural-traveler.png"),
};

export function getAvatarSource(avatarName: string, photoUri?: string) {
  if (photoUri) {
    return { uri: photoUri };
  }
  return avatars[avatarName as keyof typeof avatars] || avatars["backpacker"];
}

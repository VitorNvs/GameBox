// src/components/MiniProfile.jsx
import React from "react";
import { Box, Avatar, Typography, Divider } from "@mui/material";

const MiniProfile = ({ user }) => {
    if (!user) return null;

    return (
        <Box
            sx={{
                width: 280,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 5,
                overflow: "hidden",
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    width: "100%",
                    height: 80,
                    backgroundImage: `url(${user.headerImg || "/default-header.jpg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* AVATAR */}
            <Box sx={{ position: "relative", p: 2, pt: 0 }}>
                <Avatar
                    src={user.avatar}
                    sx={{
                        width: 70,
                        height: 70,
                        border: "3px solid white",
                        position: "relative",
                        top: -35,
                    }}
                />

                {/* USER INFO */}
                <Box sx={{ mt: -2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        @{user.username}{/* id curto estilo twitter */}
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* SEGUIDORES E AVALIAÇÕES */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {user.following?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            seguindo
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {user.followers?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            seguidores
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {user.reviewsCount || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            avaliações
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MiniProfile;

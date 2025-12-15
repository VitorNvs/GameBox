import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { setUser } from '../redux/authSlice'; // Assumindo que você tem uma ação setUser no seu authSlice
import ReviewModal from "../components/ReviewModal";
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Slider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FaHeart, FaThumbsUp, FaTimes } from "react-icons/fa";
import Cropper from "react-easy-crop";
import api from "../api";

/**
 * helpers
 * getCroppedImg: cria um blob a partir da imagem + pixelCrop usando canvas (100% js)
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous"); // evita problemas CORS para canvas
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", 0.92);
  });
}

/**
 * componente principal
 */
export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  api.get("/perfil").then((res) => {
  setReviews(res.data.reviews || []);
  setAvatar(res.data.user?.avatar || null);
  setHeaderImg(res.data.user?.headerImg || null);
  setProfileUser(res.data.user);
});

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClickGame = (review) => {
    console.log(review);
    setSelectedReview(review.review); // ou game.myReview, depende do nome q vc usa
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReview(null);
  };

  // NOVO ESTADO: Controla se a validação do token pelo API já foi concluída
  const [isAuthValidating, setIsAuthValidating] = useState(true);

  // imagens atuais (da api/user)
  const [avatar, setAvatar] = useState(null);
  const [headerImg, setHeaderImg] = useState(null);

  // modais básicos
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [headerModalOpen, setHeaderModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // stats modal
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [statsType, setStatsType] = useState(null);

  // cropper
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropFor, setCropFor] = useState(null); // "avatar" | "header"
  const [tempImageSrc, setTempImageSrc] = useState(null); // url do arquivo carregado
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const avatarInputRef = useRef(null);
  const headerInputRef = useRef(null);

  // autorização / carregar perfil
  useEffect(() => {
    const validacaoUsuario = async () => {
      const token = localStorage.getItem("token");
      if(!token){
        console.log("Token não encontrado, redirecionando para login.");
        setIsAuthValidating(false);
        navigate("/login");
        return;
      }

      try {
      
        const response = await api.get("auth/validate",{
          headers:{
            Authorization : `Bearer ${token}`
          }
        });
        
        // Se a validação for 200/OK, atualiza o estado do Redux 
        if (response.data && response.data.user) {
            console.log("Token válido, atualizando estado Redux.");
            // DISPATCH CRUCIAL: Atualiza o estado global do usuário com os dados validados
            dispatch(setUser(response.data.user)); 
        }

        
        console.log("Acesso autorizado!",response.data.user.username);
        
      } catch (error) {
        // Se houver erro de validação (token inválido/expirado), limpa o token e redireciona
        console.error("Erro na validação de token (expirado/inválido).", error.response?.status || error.message);
        dispatch(logout());
        // Usamos navigate para redirecionar para login
        navigate("/login");
      } finally {
        // A validação, bem ou mal sucedida, terminou.
        setIsAuthValidating(false);
        console.log(`Validação do token concluída. Autenticado: ${isAuthenticated}`);
      }
    }
    
    if (!user || isAuthValidating) {
      validacaoUsuario();
    }
  },[navigate, dispatch, user]);

  /*
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);
*/

  useEffect(() => {
    if (!isAuthValidating && isAuthenticated && user) {
      api
        .get("/perfil")
        .then((res) => {
          setReviews(res.data.reviews || []);
          setAvatar(res.data.user?.avatar || null);
          setHeaderImg(res.data.user?.headerImg || null);
        })
        .catch((err) => console.error("Erro ao carregar perfil:", err));
    }
  }, [isAuthValidating, isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleDeleteReview = async (reviewId) => {
  if (!window.confirm("tem certeza que quer deletar essa review?")) return;

  try {
    await api.delete(`/reviews/${reviewId}`); 
    // remove no estado local
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  } catch (err) {
    console.error("erro ao deletar review:", err);
  }
};


  const openStatsModal = (type) => {
    setStatsType(type);
    setStatsModalOpen(true);
  };
  const closeStatsModal = () => setStatsModalOpen(false);

  // ao selecionar arquivo (mas não envia imediatamente) - abrimos crop modal
  const onFileSelectedForCrop = async (file, target) => {
    if (!file) return;
    // cria url temporária
    const url = URL.createObjectURL(file);
    setTempImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropFor(target); // 'avatar' ou 'header'
    setCropModalOpen(true);
  };

  // handlers quando usuário escolhe "alterar foto" nos modais
  const onClickChangeAvatar = () => {
    // abre o seletor de arquivos -> quando o usuário escolher, trataremos
    avatarInputRef.current?.click();
    setAvatarModalOpen(false);
  };

  const onClickChangeHeader = () => {
    headerInputRef.current?.click();
    setHeaderModalOpen(false);
  };

  // input change -> prepara crop
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    await onFileSelectedForCrop(file, "avatar");
    e.target.value = null;
  };

  const handleHeaderFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    await onFileSelectedForCrop(file, "header");
    e.target.value = null;
  };

  // cropper callback
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // confirmar crop -> gera blob, envia para backend e aplica
  const handleConfirmCrop = async () => {
    try {
      const blob = await getCroppedImg(tempImageSrc, {
        x: Math.round(croppedAreaPixels.x),
        y: Math.round(croppedAreaPixels.y),
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
      });

      // cria um file para enviar
      const fileName = `${cropFor}_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const formData = new FormData();
      if (cropFor === "avatar") formData.append("avatar", file);
      else formData.append("header", file);

      const endpoint = cropFor === "avatar" ? "/upload/avatar" : "/upload/header";

      const res = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (cropFor === "avatar") {
        setAvatar(res.data.avatarUrl);
      } else {
        setHeaderImg(res.data.headerUrl);
      }
    } catch (err) {
      console.error("erro ao processar crop:", err);
    } finally {
      // limpa estados
      setCropModalOpen(false);
      setTempImageSrc(null);
      setCropFor(null);
      setCroppedAreaPixels(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  // ver imagem (full view)
  const handleViewImage = (src) => {
    setSelectedImage(src);
    setShowImageModal(true);
  };

  // RENDERIZAÇÃO CONDICIONAL
  // Se estiver validando OU se a validação terminou e não temos usuário (algo falhou)
  if (isAuthValidating || !user){
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f1720' }}>
        <CircularProgress color="primary" />
        <Typography color="white" sx={{ ml: 2 }}>
          Carregando perfil...
        </Typography>
      </Box>
    );
  } 

  return (
    <Box>
      {/* HEADER AREA (click abre modal com opções) */}
      <Box
        sx={{
          height: 300,
          cursor: "pointer",
          backgroundColor: "#0f1720",
          position: "relative",
        }}
        onClick={() => setHeaderModalOpen(true)}
      >
        <img
          src={headerImg || "https://via.placeholder.com/1200x300?text=Capa+do+Perfil"}
          alt="capa"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // será substituído pelo crop final. o crop controla a imagem real.
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <Paper
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            mt: -8,
            gap: 3,
            background: "#171a22",
          }}
        >
          {/* AVATAR */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={avatar || "https://via.placeholder.com/150"}
              sx={{
                width: 150,
                height: 150,
                border: "4px solid #0f1720",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
              }}
              onClick={() => setAvatarModalOpen(true)}
            />
          </Box>

          <Box>
            <Typography variant="h3" fontWeight="700" color="white">
  {profileUser?.displayName}
</Typography>

<Typography color="gray">
  @{profileUser?.username}
</Typography>

          </Box>

          <Box sx={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => openStatsModal("reviews")}
            >
              <Typography variant="h5" color="white">
                {reviews.length}
              </Typography>
              <Typography color="gray">Avaliações</Typography>
            </Box>

            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => openStatsModal("followers")}
            >
              <Typography variant="h5" color="white">
                0
              </Typography>
              <Typography color="gray">Seguidores</Typography>
            </Box>

            <Box
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={() => openStatsModal("following")}
            >
              <Typography variant="h5" color="white">
                0
              </Typography>
              <Typography color="gray">Seguindo</Typography>
            </Box>
          </Box>
        </Paper>

        {/* JOGOS AVALIADOS */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Jogos Avaliados
            </Typography>

            <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                height: 8,
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#333",
                borderRadius: 4,
              },
            }}
          >
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card
                  key={review._id}
                  sx={{
                    minWidth: 240,
                    maxWidth: 240,
                    flexShrink: 0,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="190"
                    image={review.gameId?.image || ""}
                    onClick={() => handleClickGame(review)}   // CLICK NA FOTO
                    sx={{ cursor: "pointer" }}
                  />

                  <CardContent>
                    <Typography variant="h6">{review.gameId?.title}</Typography>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // impede abrir o modal ao clicar no botão
                        handleDeleteReview(review._id);
                      }}
                      sx={{ mt: 1 }}
                    >
                      deletar
                    </Button>
                  </CardContent>
</Card>

              ))
            ) : (
              <Typography sx={{ ml: 2 }}>você ainda não fez nenhuma análise.</Typography>
            )}
          </Box>

          <ReviewModal 
      open={modalOpen} 
      onClose={closeModal} 
      review={selectedReview}
    />

          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Button variant="contained" color="error" fullWidth onClick={handleLogout}>
                Sair da Conta
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* modal para ver imagem em grande */}
      <Modal open={showImageModal} onClose={() => setShowImageModal(false)}>
        <Box
          sx={{
            background: "rgba(0,0,0,0.95)",
            p: 2,
            mx: "auto",
            mt: "6%",
            width: "80%",
            maxHeight: "85vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={selectedImage}
            alt="visualizar"
            style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
        </Box>
      </Modal>

      {/* modal avatar (ver/alterar) */}
      <Modal open={avatarModalOpen} onClose={() => setAvatarModalOpen(false)}>
        <Box
          sx={{
            background: "#1c1f2b",
            width: 360,
            p: 3,
            borderRadius: 2,
            mx: "auto",
            mt: "14%",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Foto de Perfil
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            onClick={() => {
              handleViewImage(avatar || "https://via.placeholder.com/150");
              setAvatarModalOpen(false);
            }}
          >
            Ver foto
          </Button>

          <Button variant="contained" color="primary" fullWidth onClick={onClickChangeAvatar}>
            Alterar foto
          </Button>

          <Button fullWidth sx={{ mt: 1 }} onClick={() => setAvatarModalOpen(false)}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      {/* modal header (ver/alterar) */}
      <Modal open={headerModalOpen} onClose={() => setHeaderModalOpen(false)}>
        <Box
          sx={{
            background: "#1c1f2b",
            width: 360,
            p: 3,
            borderRadius: 2,
            mx: "auto",
            mt: "14%",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Imagem de Capa
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            onClick={() => {
              handleViewImage(headerImg || "https://via.placeholder.com/1200x300");
              setHeaderModalOpen(false);
            }}
          >
            Ver imagem
          </Button>

          <Button variant="contained" color="primary" fullWidth onClick={onClickChangeHeader}>
            Alterar imagem
          </Button>

          <Button fullWidth sx={{ mt: 1 }} onClick={() => setHeaderModalOpen(false)}>
            Cancelar
          </Button>
        </Box>
      </Modal>

      {/* modal stats (reviews / followers / following) */}
      <Modal open={statsModalOpen} onClose={closeStatsModal}>
        <Box
          sx={{
            background: "#111316",
            width: 420,
            borderRadius: 2,
            p: 3,
            mx: "auto",
            mt: "12%",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">
              {statsType === "reviews" && "Minhas Avaliações"}
              {statsType === "followers" && "Seguidores"}
              {statsType === "following" && "Seguindo"}
            </Typography>
            <IconButton onClick={closeStatsModal} sx={{ color: "white" }}>
              <FaTimes />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2 }}>
            {statsType === "reviews" && (
              <>
                {reviews.length > 0 ? (
                  reviews.map((r) => (
                    <Box key={r._id} sx={{ mb: 1 }}>
                      <Typography>• {r.gameId?.title}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>Nenhuma avaliação.</Typography>
                )}
              </>
            )}

            {(statsType === "followers" || statsType === "following") && (
              <Typography>Nada aqui ainda…</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      {/* crop modal */}
      <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
        <Box
          sx={{
            width: "90%",
            maxWidth: 900,
            height: "80vh",
            mx: "auto",
            mt: "4vh",
            bgcolor: "#0b0c0f",
            borderRadius: 2,
            p: 2,
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">
              {cropFor === "avatar" ? "Ajustar Avatar (corte redondo)" : "Ajustar Capa (3:1)"}
            </Typography>
            <IconButton onClick={() => setCropModalOpen(false)} sx={{ color: "white" }}>
              <FaTimes />
            </IconButton>
          </Box>

          <Box
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: 500,
                height: 500,
                mx: "auto",
                mt: 2,
                background: "#111315",
                borderRadius: 1
            }}
            >

            {tempImageSrc && (
              <Cropper
                image={tempImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropFor === "header" ? 3 / 1 : 1 / 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                objectFit="horizontal-cover"
              />
            )}
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <Typography>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.01}
              onChange={(e, v) => setZoom(v)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleConfirmCrop}>
              Confirmar
            </Button>
            <Button variant="outlined" onClick={() => setCropModalOpen(false)}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* inputs invisíveis */}
      <input
        ref={avatarInputRef}
        id="avatar-file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarFileChange}
      />
      <input
        ref={headerInputRef}
        id="header-file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleHeaderFileChange}
      />
    </Box>
  );
}
import React, { useState } from "react";
import {
    Grid,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Button,
} from "@mui/material";
import * as Icons from "@mui/icons-material";

const IconGridWithHorizontalFilters = ({ onIconSelect }) => {
    // Charger toutes les icônes disponibles
    const allIcons = Object.keys(Icons).map((iconName) => ({
        name: iconName,
        component: Icons[iconName], // Composant d'icône React
    }));

    // États locaux : pour gérer la recherche, les filtres et l'icône sélectionnée
    const [searchInput, setSearchInput] = useState("");
    const [iconStyle, setIconStyle] = useState("All");
    const [selectedIcon, setSelectedIcon] = useState(null);

    // Filtrage des icônes par recherche et styles
    const filteredIcons = allIcons.filter((icon) => {
        const matchesSearch = icon.name.toLowerCase().includes(searchInput.toLowerCase());
        let matchesStyle = true;

        if (iconStyle === "Filled") {
            matchesStyle = !icon.name.includes("Outlined") && !icon.name.includes("Rounded") &&
                !icon.name.includes("TwoTone") && !icon.name.includes("Sharp");
        } else if (iconStyle !== "All") {
            matchesStyle = icon.name.endsWith(iconStyle);
        }

        return matchesSearch && matchesStyle;
    });

    // Fonction appelée pour confirmer la sélection
    const confirmIconSelection = () => {
        if (selectedIcon && onIconSelect) {
            onIconSelect(selectedIcon.name); // Appelle la fonction avec le nom de l'icône
        } else {
            alert("Veuillez sélectionner une icône avant de valider !");
        }
    };

    return (
        <Grid container spacing={3} sx={{ padding: 3 }}>
            {/* Barre horizontale : Recherche, Filtre et Bouton */}
            <Grid item xs={12}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                        marginBottom: 2,
                    }}
                >
                    {/* Champ de recherche */}
                    <TextField
                        label="Rechercher"
                        variant="outlined"
                        size="small"
                        sx={{ flex: 1, minWidth: "150px" }}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />

                    {/* Filtre par style */}
                    <FormControl size="small" sx={{ minWidth: "150px" }}>
                        <InputLabel id="icon-style-label">Style</InputLabel>
                        <Select
                            labelId="icon-style-label"
                            value={iconStyle}
                            onChange={(e) => setIconStyle(e.target.value)}
                        >
                            <MenuItem value="All">Tous</MenuItem>
                            <MenuItem value="Filled">Filled</MenuItem>
                            <MenuItem value="Outlined">Outlined</MenuItem>
                            <MenuItem value="Rounded">Rounded</MenuItem>
                            <MenuItem value="TwoTone">Two-Tone</MenuItem>
                            <MenuItem value="Sharp">Sharp</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Bouton Valider */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={confirmIconSelection}
                        disabled={!selectedIcon} // Désactivé si aucune icône sélectionnée
                        sx={{ minWidth: "150px" }}
                    >
                        Valider la sélection
                    </Button>
                </Box>
            </Grid>

            {/* Grille des icônes */}
            <Grid item xs={12}>
                <Grid container spacing={2} sx={{ maxHeight: "70vh", overflowY: "auto" }}>
                    {filteredIcons.map((icon) => (
                        <Grid item xs={6} sm={4} md={2} key={icon.name}>
                            <Paper
                                elevation={selectedIcon?.name === icon.name ? 4 : 1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 1,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    border: selectedIcon?.name === icon.name ? "2px solid #1976d2" : "1px solid #ddd",
                                    backgroundColor:
                                        selectedIcon?.name === icon.name ? "#e3f2fd" : "#fff",
                                    "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                                onClick={() => setSelectedIcon(icon)}
                            >
                                {/* Icône */}
                                <Box
                                    sx={{
                                        fontSize: 40,
                                        color: selectedIcon?.name === icon.name ? "#1976d2" : "inherit",
                                    }}
                                >
                                    {React.createElement(icon.component)}
                                </Box>

                                {/* Nom de l'icône avec gestion des textes longs */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        marginTop: 1,
                                        fontWeight: selectedIcon?.name === icon.name ? 700 : 400,
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        textAlign: "center",
                                    }}
                                >
                                    {icon.name}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default IconGridWithHorizontalFilters;
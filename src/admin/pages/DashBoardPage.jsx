import React, {useState, useEffect} from 'react';
import {Box, Grid, Card, CardContent, Typography, CircularProgress} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simuler la génération de données (AJAX, API ou autres)
        const fetchData = () => {
            const generatedData = [...Array(10)].map((_, index) => ({
                id: index + 1,
                name: `User ${index + 1}`,
                age: Math.floor(Math.random() * 50) + 20,
                country: ['USA', 'France', 'Germany', 'Japan'][Math.floor(Math.random() * 4)],
                score: Math.round(Math.random() * 100),
            }));
            setData(generatedData);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Colonnes pour la table
    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'name', headerName: 'Name', width: 150},
        {field: 'age', headerName: 'Age', width: 100},
        {field: 'country', headerName: 'Country', width: 150},
        {field: 'score', headerName: 'Score', width: 100},
    ];

    return (
        <Box sx={{flexGrow: 1, padding: 4}}>
            <Typography variant="h4" gutterBottom align="center">
                Dashboard de Données
            </Typography>
            <Grid container spacing={3}>
                {/* Statistiques rapides */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Total Utilisateurs</Typography>
                            <Typography variant="h4">{data.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Score Moyen</Typography>
                            <Typography variant="h4">
                                {data.length > 0
                                    ? (data.reduce((acc, curr) => acc + curr.score, 0) / data.length).toFixed(2)
                                    : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Pays Principaux</Typography>
                            <Typography variant="h4">
                                {
                                    [...new Set(data.map((item) => item.country))].length // Comptage des pays uniques
                                }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Âge Moyen</Typography>
                            <Typography variant="h4">
                                {data.length > 0
                                    ? (data.reduce((acc, curr) => acc + curr.age, 0) / data.length).toFixed(1)
                                    : 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{height: 400, marginTop: 4}}>
                <Typography variant="h6" gutterBottom>
                    Liste des Données
                </Typography>
                {loading ? (
                    <Box
                        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}
                    >
                        <CircularProgress/>
                    </Box>
                ) : (
                    <DataGrid rows={data} columns={columns} pageSize={5}/>
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;
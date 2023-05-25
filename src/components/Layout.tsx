import { AppBar, Toolbar, IconButton, Icon, Typography, Container, Drawer, Link, List, ListItem, Theme, Box } from "@mui/material";
import { useState, useCallback } from "react";

export interface Props {
    children: React.ReactNode
}

export default function Layout({ children }: Props) {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>();
    const onClose = useCallback(() => {
        setIsDrawerOpen(!isDrawerOpen);
    }, [isDrawerOpen]);
    
    return (
        <div>
            <header>
                <AppBar position="static" sx={{ mb: "1rem" }}>
                    <Box sx={{width: "100%", maxWidth: (theme: Theme) => theme.breakpoints.values.lg, ml: "auto", mr: "auto"}}>
                    {/* <Container maxWidth="lg"> */}
                        <Toolbar>
                            <IconButton onClick={onClose} sx={{ color: "white" }}>
                                <Icon>menu</Icon>
                            </IconButton>
                            <Typography sx={{ fontSize: "16px", fontWeight: 700, mr: 2 }}>Unavailable Youtube Video Remover</Typography>
                            <Typography sx={{
                                display: {
                                    "xs": "none",
                                    "md": "unset"
                                }
                            }}>Remove unavailable videos from your playlists and hide the "Unavailable video" message</Typography>
                        </Toolbar>
                    {/* </Container> */}
                    </Box>
                </AppBar>
            </header>
            <Container maxWidth="lg" component="main">
                <Drawer open={isDrawerOpen} onClose={onClose}>
                    <List sx={{width: 200}}>
                        <ListItem>
                            <Link>Home</Link>
                        </ListItem>
                        <ListItem>
                            <Link>About</Link>
                        </ListItem>
                    </List>
                </Drawer>
                {children}
            </Container>
        </div>
    );
}
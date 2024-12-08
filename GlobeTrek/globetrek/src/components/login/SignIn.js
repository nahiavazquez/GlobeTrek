import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, ThemeProvider } from '@mui/material/styles'; 
import { GoogleIcon } from './CustomIcons';
import AppTheme from '../../../src/shared-theme/AppTheme';
import { useTranslation } from 'react-i18next';
import { GTAppBar } from '../../components/AppBar'
import { useParams } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { t, i18n } = useTranslation();
  const { language = 'en' } = useParams();

  async function googleauth() {
    localStorage.setItem("language", language);
    const response = await fetch(`${process.env.REACT_APP_GATEWAY_URL}/api/login`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      const data = await response.json();
      if (data.redirect_url) {
          window.location.href = data.redirect_url;
      }
    }
  }

  React.useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
        return;
    }

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
        setLoading(true);

        const response = await fetch(`${process.env.REACT_APP_GATEWAY_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        });

        setLoading(false);

        if (!response.ok) {
            if (response.status === 400) {
                alert("Login failed: Incorrect email or password.");
            } else {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }
            return;
        }

        const data = await response.json();

        if (data.user_id === undefined) {
            alert("User not found.");
            return;
        }

        localStorage.setItem("access_token", data.access_token);

        window.location.href = `/GlobeTrek/${language}/home/${data.user_id}`;
    } catch (error) {
        console.error("Login failed:", error.message);
        alert("An error occurred during login. Please try again.");
    }
};

const validateInputs = () => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  let isValid = true;

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
  } else {
      setEmailError(false);
      setEmailErrorMessage('');
  }

  if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
  } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
  }

  return isValid;
};

  return (
    <ThemeProvider theme={AppTheme}> 
      <CssBaseline enableColorScheme />
      <GTAppBar withMenu={false}/>
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined" sx={{marginTop: '10vh'}}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {t('Sign in')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">{t('Email')}</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder={t("your@email.com")}
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
              />
            </FormControl>
            <FormControl>
            <FormLabel htmlFor="password">{t('Password')}</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              {t('Sign in')}
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              {t('Don’t have an account?')}{' '}
              <span>
                <Link
                  href={`/GlobeTrek/${language}/register`}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  {t('Sign up')}
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>{t('or')}</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={googleauth}
              startIcon={<GoogleIcon />}
            >
              {t('Sign in with Google')}
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </ThemeProvider>
  );
}

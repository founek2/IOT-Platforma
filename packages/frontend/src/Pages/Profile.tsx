import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SecurityIcon from '@material-ui/icons/Security';
import { IUser } from 'common/lib/models/interface/userInterface';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { accessTokensActions } from '../store/actions/accessTokens';
import { RootState } from '../store/store';
import Account from './profile/Account';
import AccessTokens from './profile/AcessTokens';
import Security from './profile/Security';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(2),
    },
    link: {
        display: 'flex',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
    breadCrumbsOl: {
        justifyContent: 'center',
    },
}));

const menu = [
    { icon: AccountCircleIcon, text: 'Účet', link: '/profile' },
    { icon: AccessibilityIcon, text: 'Přístupnost', link: '/profile/accessTokens' },
    { icon: SecurityIcon, text: 'Zabezpečení', link: '/profile/security' },
    // { icon: PersonAddIcon, text: "Vytvořit uživatele", link: "/profile/addUser", role: "ENTITY_MANAGER" }
];

function Profile({ location, match }: RouteComponentProps) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const userId = useSelector<RootState, IUser['_id'] | undefined>((state) => state.application.user?._id);

    useEffect(() => {
        if (userId) dispatch(accessTokensActions.fetch(userId));
    }, [dispatch, userId]);

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb" classes={{ ol: classes.breadCrumbsOl }}>
                {menu.map(({ icon: Icon, text, link }) => (
                    <Link to={link} className={classes.link} key={text}>
                        <Icon className={classes.icon} />
                        <Typography
                            color={location.pathname === link ? 'textPrimary' : 'inherit'}
                            className={classes.link}
                        >
                            {text}
                        </Typography>
                    </Link>
                ))}
            </Breadcrumbs>
            <Switch>
                <Route component={Security} path={`${match.path}/security`} />
                <Route component={AccessTokens} path={`${match.path}/accessTokens`} />
                <Route component={Account} path={match.path} exact />
            </Switch>
        </div>
    );
}

export default Profile;

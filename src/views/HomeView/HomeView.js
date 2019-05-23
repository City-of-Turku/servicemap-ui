import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, withStyles, Button,
} from '@material-ui/core';
import { injectIntl, intlShape } from 'react-intl';
import { Search } from '@material-ui/icons';
import Container from '../../components/Container';
import SearchBar from '../../components/SearchBar';
import { MobileComponent } from '../../layouts/WrapperComponents/WrapperComponents';
import HomeLogo from '../../components/Logos/HomeLogo';
import TitledList from '../../components/Lists/TitledList/TitledList';
import SimpleListItem from '../../components/ListItems/SimpleListItem/SimpleListItem';

// TODO: Fix close by events and services lists with actual data items once data is accessible

class HomeView extends React.Component {
  componentDidMount() {
    const { setCurrentPage } = this.props;
    setCurrentPage('home');
  }

  onExapmleItemClick = (e, searchText) => {
    e.preventDefault();
    const {
      fetchUnits, navigator,
    } = this.props;
    if (navigator) {
      navigator.push('search', searchText);
    }

    if (searchText && searchText !== '') {
      fetchUnits([], null, searchText);
    }
  }


  render() {
    const { intl, classes } = this.props;

    return (
      <>
        <MobileComponent>
          <Container>
            <HomeLogo dark aria-label={intl.formatMessage({ id: 'app.title' })} />
          </Container>
        </MobileComponent>
        <SearchBar
          hideBackButton
          placeholder={intl.formatMessage({ id: 'search' })}
        />
        <Container paper>
          <TitledList title={intl.formatMessage({ id: 'home.example.title' })} divider={false}>
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Kallion kirjasto')} text="Kallion kirjasto" srText={intl.formatMessage({ id: 'home.example.search' })} />
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Uimahallit')} text="Uimahallit" srText={intl.formatMessage({ id: 'home.example.search' })} />
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Terveysasemat Espoo')} text="Terveysasemat Espoo" srText={intl.formatMessage({ id: 'home.example.search' })} />
            <SimpleListItem link icon={<Search />} handleItemClick={e => this.onExapmleItemClick(e, 'Pysäköintilippuautomaatit')} text="Pysäköintilippuautomaatit" srText={intl.formatMessage({ id: 'home.example.search' })} />
          </TitledList>
        </Container>

        <Container paper>
          <Typography
            className={classes.left}
            variant="subtitle1"
            component="h3"
          >
            {intl.formatMessage({ id: 'home.message' })}
          </Typography>
          <Typography className={classes.left} variant="body2">
            <b>14.5.2019</b>
            {' '}
- Olemme saaneet ensimmäisten viikkojen aikana ensimmäiset palautteet
            - kiitos niistä! Palautteen perusteella keskitymme seuraavaksi rakentamaan entistäkin
            paremman toimipisteen sivun, josta löydät kaikki toimipisteen tiedot esteettömyydestä
            tapahtumiin.
            {' '}
            <br />
            <br />
            <b>2.5.2019</b>
            {' '}
- Olemme tänään julkistaneet Palvelukartan avoimen kehitysversion!
            Ensimmäisessä versiossa keskitymme erityisesti hakukokemuksen parantamiseen.
            Lisäämme kehitysversioon uusia ominaisuuksia viikottain
            ja haluamme palautetta juuri sinulta.
            <br />
          </Typography>
          <Button
            className={classes.button}
            role="link"
            variant="contained"
            color="primary"
            onClick={() => window.open('https://forms.gle/roe9XNrZGQWBhMBJ7')}
            aria-label={`${intl.formatMessage({ id: 'home.send.feedback' })}: ${intl.formatMessage({ id: 'general.new.tab' })}`}
          >
            {intl.formatMessage({ id: 'home.send.feedback' })}
          </Button>
        </Container>

        {/* <Container paper title={intl.formatMessage({ id: 'service.nearby' })}>
          <List>
            <ListItem>
              <ListItemText primary={intl.formatMessage({ id: 'general.noData' })} />
            </ListItem>
          </List>
        </Container>

        <Container paper title={intl.formatMessage({ id: 'event.nearby' })}>
          <List>
            <ListItem>
              <ListItemText primary={intl.formatMessage({ id: 'general.noData' })} />
            </ListItem>
          </List>
    </Container> */}
      </>
    );
  }
}

const styles = theme => ({
  left: {
    textAlign: 'left',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 3,
  },
  button: {
    marginLeft: '15%',
    marginRight: '15%',
    width: '70%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
});


export default injectIntl(withStyles(styles)(HomeView));

// Typechecking
HomeView.propTypes = {
  fetchUnits: PropTypes.func,
  setCurrentPage: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

HomeView.defaultProps = {
  fetchUnits: () => {},
  navigator: null,
};

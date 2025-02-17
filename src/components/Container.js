import React, { Component } from 'react'
import GithubCorner from 'react-github-corner'
import { withStyles } from '@material-ui/core/styles'
import rhof from '@gh-conf/rhof'

import { ButtonPrimary, CircularProgress, HallOfFame, Heading, Input, PopupDialog, Credit } from '../components'

const styles = theme => ({})

class Container extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hof: '',
      validateMessage: '',
      showPopup: false,
      isLoading: false
    }
  }

  updateContributors = async (username, repository) => {
    const contributors = await rhof(username, repository)
    this.setState({
      hof: contributors,
      isLoading: false
    })
  }

  handleOnChange = event => {
    if (event.target) {
      const name = event.target.name
      const value = event.target.value
      console.log(value)
      this.setState({
        [name]: value
      })
    }
  }

  handleOnSubmit = async () => {
    // Validate if username and repository input is given
    if (!this.state.username || !this.state.repository) {
      this.setState({
        showPopup: true,
        validateMessage: 'Username and repository cannot be empty'
      })
      return false
    }

    // Start Loader
    this.setState({ isLoading: true })

    // Update contributors hof in state
    await this.updateContributors(this.state.username, this.state.repository)
  }

  handlePopupClose = () => {
    // Closes popup
    this.setState({ showPopup: false })
  }

  render() {
    const { hof, isLoading, showPopup, validateMessage } = this.state

    return (
      <div className="container">
        <GithubCorner href="https://github.com/arshadkazmi42/gh-rhof" />
        <Heading className="heading">
          <div className="git-img">
          <img src="http://geekytheory.com/wp-content/uploads/2014/05/historia_octocat.jpg" alt="Github image" />
          </div>
          <div className="main-text">
            Generate Github Respository <br></br>Hall of Fame
          </div>
        </Heading>
        <PopupDialog
          showPopup={showPopup}
          onClose={this.handlePopupClose}
          title={'Error!!!'}
          message={validateMessage}
        />
        <Input
          className="input"
          required
          error={showPopup}
          name="Username"
          defaultValue=""
          onChange={this.handleOnChange}
        />
        <Input
          className="input"
          required
          error={showPopup}
          name="Repository"
          defaultValue=""
          onChange={this.handleOnChange}
        />
        <ButtonPrimary className="button" onClick={this.handleOnSubmit}>
          Get Contributors
        </ButtonPrimary>
        {isLoading && <CircularProgress />}
        {hof && <HallOfFame classes={{ hof: 'hof-container' }} hof={hof} />}
        <Credit />
      </div>
    )
  }
}

export default withStyles(styles)(Container)

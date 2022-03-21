import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'

import {
  AppContainer,
  InputSelect,
  ProjectsList,
  LoaderDiv,
  FailureDiv,
  Image,
  Heading,
  Description,
  RetryButton,
  HeaderContainer,
  HeaderImage,
} from './styles'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
    categoryId: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjects()
  }

  onChangeCategory = event => {
    this.setState({categoryId: event.target.value}, () => this.getProjects())
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {categoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${categoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onRetry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <FailureDiv>
      <Image
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <Heading>Oops! Something Went Wrong</Heading>
      <Description>
        We cannot seem to find the page you are looking for.
      </Description>
      <RetryButton type="button" onClick={this.onRetry}>
        Retry
      </RetryButton>
    </FailureDiv>
  )

  renderLoadingView = () => (
    <LoaderDiv data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </LoaderDiv>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state

    return (
      <ProjectsList>
        {projectsList.map(eachItem => (
          <ProjectItem key={eachItem.id} projectDetails={eachItem} />
        ))}
      </ProjectsList>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {categoryId} = this.state

    return (
      <>
        <HeaderContainer>
          <HeaderImage
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </HeaderContainer>
        <AppContainer>
          <InputSelect value={categoryId} onChange={this.onChangeCategory}>
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </InputSelect>
          {this.renderProjects()}
        </AppContainer>
      </>
    )
  }
}

export default ProjectDetails

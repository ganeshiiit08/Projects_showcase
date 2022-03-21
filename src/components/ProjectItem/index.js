import {ItemList, ProjectImage, ProjectName} from './styles'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <ItemList>
      <ProjectImage src={imageUrl} alt={name} />
      <ProjectName>{name}</ProjectName>
    </ItemList>
  )
}

export default ProjectItem

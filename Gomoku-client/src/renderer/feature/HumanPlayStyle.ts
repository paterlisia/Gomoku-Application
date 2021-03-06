import styled from 'styled-components';
import backgroundImage from 'assets/imgs/wood-bg.jpg';

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${backgroundImage});
`;

export default AppContainer;

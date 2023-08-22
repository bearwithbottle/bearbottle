import { styled } from "styled-components";
import img from "../../assets/listtwo/cynical.png";

export const Two3Box = styled.div`
  width: 150px;
  height: 146px;
  border-radius: 12px;
  background-color: #afafaf;
  font-family: "ImcreSoojin";
`;
export const Two3Wrarp = styled.div`
  width: 150px;
  height: 140px;
  border-radius: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
`;
export const Two3img = styled.div`
  width: 52px;
  height: 48px;
  margin-bottom: 20px;
  background-image: url(${img});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;
export const BtnTextBox = styled.div`
  width: 126px;
  height: 36px;
  border-radius: 7px;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  color: #8977f4;
  background-color: #e3deff;
`;

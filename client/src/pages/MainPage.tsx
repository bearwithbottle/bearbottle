/* eslint-disable react-hooks/exhaustive-deps */
import {
  WaitBox,
  LodingBox,
  LodingGom,
  LodingText,
  BarMainBox,
  BarDisplay,
  Title,
  TextPongBox,
  TextImg,
  TextPongBox33,
  MidBox,
  TextPongContents,
  MidGom,
  BtnBox,
  LettersBox,
  LetterCodeBox,
  LetterStiker,
  LogoutBox,
  LogoutText,
} from "../styles/mainbar";
import { useState, useEffect } from "react";

import ShareBtn from "../components/btn/ShareBtn";
import Refrigerator from "../components/btn/Refrigerator";
import ChangeName from "../components/btn/ChangeName";
import RfriModal from "../components/main/RefriModal";
import BottlesModal from "../components/main/BottlesModal";
import LogoutModal from "../components/main/LogoutModal";
import Share from "../components/Share";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../config";
import {
  DocumentData,
  doc,
  getDoc,
  query,
  getDocs,
  where,
  limit,
  collection,
} from "firebase/firestore";

import { setImage, setName } from "../action";
import { Link } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [arr, setArr] = useState<any>();
  const [uid, stateUid] = useState<string | null>(null);
  const [isletters, setLetters] = useState<DocumentData[]>([]);
  const [isLoding, setIsLoding] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<DocumentData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOut, setIsOut] = useState(false);
  const dispatch = useDispatch();
  const [name, image] = [
    useSelector((state: { name: string }) => state.name),
    useSelector((state: { image: string }) => state.image),
  ];
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
      } else {
        const uid = user?.uid;
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        const imgValue = userDocSnap.get("img");

        if (imgValue) {
          navigate("/bar");
        } else {
          navigate("/choosegomdol");
        }

        stateUid(uid);

        const docRef = doc(db, "users", uid);
        try {
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const { name, img, letters } = userData;
            setLetters(letters);
            dispatch(setName(name));
            dispatch(setImage(img));
          } else {
            console.log("찾을 수 없습니다");
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoding((pre) => !pre);
        }
      }
    });
    unsubscribeAuth();
  }, []);

  const getRandomLetters = () => {
    if (isletters.length <= 5) {
      return isletters;
    }

    const shuffledLetters = [...isletters];

    for (let i = 0; i < shuffledLetters.length - 1; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledLetters[i], shuffledLetters[j]] = [
        shuffledLetters[j],
        shuffledLetters[i],
      ];
    }

    return shuffledLetters.slice(0, 5);
  };
  const randomLetters = getRandomLetters();

  const handlemodal = () => {
    setIsModal((pre) => !pre);
  };

  const handleLetterClick = async (e: any, index: number) => {
    e.preventDefault();
    if (randomLetters[index]) {
      setSelectedLetter(randomLetters[index]);
      const code = randomLetters[index].code;
      const data = await getRandomBottles(code);
      setArr(data);

      setIsModalOpen(true);
    }
  };
  async function getRandomBottles(code: string) {
    const bottlesCollectionRef = collection(db, "recommend");
    const q = query(bottlesCollectionRef, where("code", "==", code), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map((doc) => doc.data());
      return documents;
    }
    return null;
  }
  const handleIndex = () => {
    setIsModalOpen(false);
  };
  const hadleShare = () => {
    setIsShare((pre) => !pre);
  };
  const handleLogout = () => {
    setIsOut((pre) => !pre);
  };
  const textPongBox =
    name.length <= 10 ? (
      <TextPongBox>
        <TextImg />
        <TextPongContents>
          {name}님 안녕하십니까?
          <br />
          자신의 Bar를 홍보 해보시죠.
        </TextPongContents>
      </TextPongBox>
    ) : (
      <TextPongBox33>
        <TextImg />
        <TextPongContents>
          {name}님
          <br />
          안녕하십니까?
          <br />
          자신의 Bar를 홍보 해보시죠.
        </TextPongContents>
      </TextPongBox33>
    );

  return (
    <WaitBox>
      {isLoding ? (
        <BarMainBox>
          {isModal && (
            <RfriModal handlemodal={handlemodal} isletters={isletters} />
          )}

          {isModalOpen && (
            <BottlesModal
              handleLetterClick={handleLetterClick}
              selectedLetter={selectedLetter}
              handleIndex={handleIndex}
              arr={arr}
            />
          )}
          {isShare && (
            <Share
              name={name}
              image={image}
              uid={uid}
              hadleShare={hadleShare}
            />
          )}
          {isOut && <LogoutModal handleLogout={handleLogout} />}
          <BarDisplay>
            <Title />
            <MidBox>
              {textPongBox}
              <MidGom image={image} />
              <LettersBox>
                {randomLetters.map((letter, index) => (
                  <li key={index} onClick={(e) => handleLetterClick(e, index)}>
                    <LetterCodeBox img={letter.setbear} />
                    <LetterStiker sticker={letter.sticker} />
                  </li>
                ))}
              </LettersBox>
            </MidBox>
            <BtnBox>
              <ShareBtn hadleShare={hadleShare} />
              <Refrigerator handlemodal={handlemodal} />
              <LogoutBox>
                <Link to={`/name`}>
                  <ChangeName />
                </Link>
                <LogoutText onClick={handleLogout}>로그 아웃</LogoutText>
              </LogoutBox>
            </BtnBox>
          </BarDisplay>
        </BarMainBox>
      ) : (
        <LodingBox>
          <LodingGom />
          <LodingText />
        </LodingBox>
      )}
    </WaitBox>
  );
}

export default MainPage;

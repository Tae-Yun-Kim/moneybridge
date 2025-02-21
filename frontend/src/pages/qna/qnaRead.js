import { useParams } from "react-router-dom";
import ReadComponent_q from "../../components/qna/ReadComponent_q";

const ReadPage = () => {
  const { qno } = useParams();

  return (
    <div className="p-4 w-full bg-white">
      <ReadComponent_q qno={qno}></ReadComponent_q>
    </div>
  );
};

export default ReadPage;

import { useParams } from "react-router-dom";
import ModifyComponent_q from "../../components/qna/ModifyComponent_q";

const ModifyPage = () => {
  const { qno } = useParams();

  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold mb-4"></div>
      <ModifyComponent_q qno={qno} />
    </div>
  );
};

export default ModifyPage;

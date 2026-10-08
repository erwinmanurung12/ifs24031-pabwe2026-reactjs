import { useDispatch, useSelector } from "react-redux";
import ModalShell from "../../../components/ModalShell";
import ReportForm from "../components/ReportForm";
import { isDone } from "../../../helpers/toolsHelper";
import { asyncChangeLostFound } from "../states/action";
import PropTypes from "prop-types";

export default function ChangeModal({ item, onClose, onSaved }) {
  const dispatch = useDispatch();
  const busy = useSelector((state) => state.lostFounds.isLostFoundChange);

  const save = async (payload) => {
    if (await dispatch(asyncChangeLostFound(item.id, payload))) {
      onSaved();
      onClose();
    }
  };

  return (
    <ModalShell title="Ubah laporan" subtitle="Perbarui keterangan atau status penyelesaian." onClose={onClose}>
      <ReportForm
        initial={{ title: item.title, description: item.description, status: item.status, completed: isDone(item) }}
        withCompleted
        busy={busy}
        submitLabel="Simpan perubahan"
        onSubmit={save}
      />
    </ModalShell>
  );
}

ChangeModal.propTypes = {
  item: PropTypes.shape({id:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),title:PropTypes.string,description:PropTypes.string,status:PropTypes.string}),
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
};

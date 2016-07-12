<?php

class Board_model extends CI_Model {

    function regist($board) {
        $SQL = "insert into board(grp, grp_seq, depth, writer, password, title, content, reg_date)"
                ." values (".$board['grp'].", ".$board['grp_seq'].", ".$board['depth'].", '".$board['writer']."', '"
                .$board['password']."', '".$board['title']."', '".$board['content']."', now())";
        $this->db->query($SQL);
        return $this->db->insert_id();
    }

    function update_grp($b_no) {
        $SQL = "update board set grp = ".$b_no." where b_no = ".$b_no;
        $this->db->query($SQL);
    }

}
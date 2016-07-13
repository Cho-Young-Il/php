<?php

class comment_model extends CI_Model{

    function getList($b_no) {
        //prevent sql injection

        $SQL = "select c_no, b_no, content, "
                ."     date_format(reg_date, '%Y/%c/%e %H:%i:%s') as reg_date "
                ."from comment "
                ."where b_no = ?";
        $query = $this->db->query($SQL, array($b_no));
        return $query->result();
    }

    function delete($b_no) {
        $SQL = "delete from comment where b_no = ?";
        $this->db->query($SQL, array($b_no));
    }

}

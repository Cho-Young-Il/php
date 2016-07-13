<?php

class attachfile_model extends CI_Model {

    function regist($attachfile) {
        $sql = "insert into attachfile(b_no, ori_name, real_name, saved_dir)"
                ." values (".$attachfile['b_no'].", '".$attachfile['ori_name']."', '"
                .$attachfile['real_name']."', '".$attachfile['saved_dir']."')";
        $this->db->query($sql);
    }

    function getList($b_no) {
        //prevent sql injection

        $SQL = "select f_no, b_no, real_name, ori_name, saved_dir "
                ."from attachfile "
                ."where b_no = ?";
        $query = $this->db->query($SQL, array($b_no));
        return $query->result_array();
    }

    function delete($b_no) {
        $SQL = "delete from attachfile where b_no = ?";
        return $this->db->query($SQL, array($b_no));
    }

    function delete_file($f_no) {
        $SQL = "delete from attachfile where f_no = ?";
        return $this->db->query($SQL, array($f_no));
    }

}

<?php

class attachfile_model extends CI_Model {

    function regist($attachfile) {
        $sql = "insert into attachfile(b_no, ori_name, real_name, saved_dir)"
                ." values (".$attachfile['b_no'].", '".$attachfile['ori_name']."', '"
                .$attachfile['real_name']."', '".$attachfile['saved_dir']."')";
        $this->db->query($sql);
    }

}
<?php

class comment_model extends CI_Model{

    function getList($b_no) {
        //prevent sql injection

        $SQL = "select c_no, b_no, writer, content, "
                ."     date_format(reg_date, '%Y/%c/%e %H:%i:%s') as reg_date "
                ."from comment "
                ."where b_no = ? "
                ."order by reg_date desc ";
        $query = $this->db->query($SQL, array($b_no));
        return $query->result();
    }

    function delete_by_bno($b_no) {
        $SQL = "delete from comment where b_no = ?";
        $this->db->query($SQL, array($b_no));
    }

    function regist($comment) {
        $SQL = "insert into comment (b_no, writer, password, content, reg_date) "
                ."values (?, ?, ?, ?, now())";
        $this->db->query($SQL, array($comment['b_no'], $comment['writer'], $comment['password'], $comment['content']));
    }

    function get_comment_pwd($c_no) {
        $SQL = "select password from comment where c_no = ?";
        return $this->db->query($SQL, array($c_no))->row()->password;
    }

    function delete($c_no) {
        $SQL = "delete from comment where c_no = ?";
        $this->db->query($SQL, array($c_no));
    }

}

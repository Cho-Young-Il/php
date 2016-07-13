<?php

class Board_model extends CI_Model {

    function regist($board) {
        $SQL = "insert into board(grp, grp_seq, depth, writer, password, title, content, reg_date)"
                ." values (".$board['grp'].", ".$board['grp_seq'].", ".$board['depth'].", '".$board['writer']."', '"
                .$board['password']."', '".$board['title']."', '".$board['content']."', now())";
        $this->db->query($SQL);
        return $this->db->insert_id();
    }

    function getList($page_maker) {
        $search_type = $page_maker['search_type'];
        $search_keyword = $page_maker['search_keyword'];

        $SQL = "select b.b_no, b.grp, b.grp_seq, b.depth, b.title, b.writer, "
                ."     date_format(reg_date, '%Y/%c/%e %H:%i:%s') as reg_date, "
                ."     (select count(*) from comment where c_no = b.b_no) as comment_cnt "
                ."from board b ";
        $CONDITION = "";
        if($search_type !== "anything" && $search_keyword &&
            ($search_type === "title" || $search_type ==="content" || $search_type === "writer")) {
            $CONDITION .= "where ".$search_type." like '%".$search_keyword."%' ";
        }
        if(($search_type === "anything" || !$search_type) && $search_keyword) {
            $CONDITION .= "where b.writer like '%".$search_keyword."%' "
                    ."  or b.title like '%".$search_keyword."%' "
                    ."  or b.content like '%".$search_keyword."%' ";
        }
        $SQL .= $CONDITION;
        $SQL .= " order by b.grp desc, b.grp_seq asc, b.reg_date desc "
                ."limit ".($page_maker['start'] - 1).", ".$page_maker['howmany_per_page'];

        $query = $this->db->query($SQL);
        $ret['board_list'] = $query->result();

        $query = $this->db->query("select b_no from board b ".$CONDITION);
        $ret['board_cnt_all'] = count($query->result_array());

        return $ret;
    }

    function detail($b_no) {
        $SQL = "select b.b_no, b.grp, b.grp_seq, b.depth, b.title, b.writer, b.content, "
                ."     date_format(reg_date, '%Y/%c/%e %H:%i:%s') as reg_date "
                ."from board b "
                ."where b_no = ?";
        $query = $this->db->query($SQL, array($b_no));
        return $query->result();
    }

    function update($update) {
        $SQL = "update board set title = ?, content = ? where b_no = ?";
        return $this->db->query($SQL, array($update['title'], $update['content'], $update['b_no']));
    }

    function delete($b_no) {
        $SQL = "delete from board where b_no = ?";
        $this->db->query($SQL, array($b_no));
    }

    function update_grp($b_no) {
        $SQL = "update board set grp = ".$b_no." where b_no = ?";
        $this->db->query($SQL, array($b_no));
    }

    function get_board_pwd($b_no) {
        $SQL = "select password from board where b_no = ?";
        return $this->db->query($SQL, array($b_no))->row()->password;
    }

}

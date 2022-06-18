import express from 'express';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from "@mui/material/Grid";
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, green, yellow, orange, blue } from '@mui/material/colors';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccordionSummary from '@mui/material/AccordionSummary';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateRequestConfig, generateURL } from 'config';
import CommentComponent from './CommentComponent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PostPage(props: any) {

  let {value,
    id_posts,
    personalValue, 
    id_users, 
    name, 
    title, 
    post_content, 
    created_at} = useParams();
    const [contentForm, setContentForm] = React.useState('');
  const [hasError, setErrors] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [isOpenShare, setOpenShare] = React.useState(false);
  const [groups, setGroups] = React.useState([]);
  const [isShowComment, setShowComment] = React.useState(false);
  const colors = [red[500], green[500], yellow[500], orange[500], blue[500]];
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [valueVote, setValueVote] = React.useState(parseInt(value == undefined ? '0': value));
  const [likeResult, setLikeResult] = React.useState(parseInt(personalValue == undefined ? '0': personalValue));
  const [likeCommentResult, setLikeCommentResult] = React.useState(new Map());
  const [comments, setComments] = React.useState([]);
  // const [comment]
  async function fetchData() {
    // console.log('fetching');
    const res = await fetch(generateURL('/comments/commentsForPost/'+id_posts), generateRequestConfig({
      method: 'GET'
    }));
    
    res
      .json()
      .then(res => {
        // console.log(res);
        setComments(res.value);
      })
      .catch(err => setErrors(err));
  }

  async function fetchDataValueForUser() {
    // console.log('fetching');
    const res = await fetch(generateURL('/comments/likeResultUser'), generateRequestConfig({
      method: 'GET'
    }));
    
    res
      .json()
      .then(res => {
        var mapp = new Map();
        res.value.map((ele: {id_comments: number, value: number})=>{
          mapp.set(ele.id_comments, ele.value);
        })
        // console.log(mapp);
        setLikeCommentResult(mapp);
      })
      .catch(err => setErrors(err));
  }

  async function fetchDataGroups() {
    // console.log('fetching');
    const res = await fetch(generateURL('/groups'), generateRequestConfig({
      method: 'GET'
    }));

    res
      .json()
      .then(res => {
        setGroups(res.groups);
      })
      .catch(err => setErrors(err));
  }

  const onVoteUpdate = async (_id_posts: number, _value: number) => {
    const data = {id_posts : _id_posts, value: _value};
    await fetch(generateURL('/posts/updateVote'), generateRequestConfig({
      method: 'POST',
      body: JSON.stringify(data)
    }));
  };

  const onVoteInsert = async (_id_posts: number, _value: number) => {
    const data = {id_posts : _id_posts, value: _value};
    await fetch(generateURL('/posts/insertVote'), generateRequestConfig({
      method: 'POST',
      body: JSON.stringify(data)
    }));
  };

  const addPostToGroupAction = async (_id_groups: number, _id_posts: number) => {
    const data = {id_groups : _id_groups, id_posts : _id_posts};
    // console.log('addPostToGroupAction');
    // console.log(data);
    await fetch(generateURL('/posts/addPostToGroup'), generateRequestConfig({
      method: 'POST',
      body: JSON.stringify(data)
    }));
  };

    React.useEffect(()=>{
      fetchData();
      fetchDataValueForUser();
      fetchDataGroups();
    }, []);

    const upVote = async () => {

      if(valueVote == null){
        setLikeResult((likeResult)+1); 
        setValueVote(1);
        if(id_posts != undefined){
          onVoteInsert(parseInt(id_posts), 1);
        }
      }
      else if(valueVote == -1){
        setLikeResult((likeResult)+1); 
        setValueVote(0);
        if(id_posts != undefined){
          onVoteUpdate(parseInt(id_posts), 0);
        }
      }
      else if(valueVote == 0){
        setLikeResult((likeResult)+1); 
        setValueVote(1);
        if(id_posts != undefined){
          onVoteUpdate(parseInt(id_posts), 1);
        }
      }
      else{
        console.log("Cannot add vote.");
      }
  }

  const downVote = () => {

    if(valueVote == null){
      setLikeResult((likeResult)-1); 
      setValueVote(-1);
      if(id_posts != undefined){
      onVoteInsert(parseInt(id_posts), -1);
      }
    }
    else if(valueVote == 1){
      setLikeResult((likeResult)-1); 
      setValueVote(0);
      if(id_posts != undefined){
      onVoteUpdate(parseInt(id_posts), 0);
      }
    }
    else if(valueVote == 0){
      setLikeResult((likeResult)-1); 
      setValueVote(-1);
      if(id_posts != undefined){
      onVoteUpdate(parseInt(id_posts), -1);
      }
    }
    else{
      console.log("Cannot add vote.");
    }
  }

  function handleChangeContent(content: string){
    setContentForm(content);
  }

  async function submit(event: any){
    event.preventDefault();
      // console.log("id_posts: ", id_posts);
      // console.log("content: ", contentForm);

    const data = {comment_content: contentForm, id_posts: id_posts};
    await fetch(generateURL('/comments/addComment'), generateRequestConfig({
      method: 'POST',
      body: JSON.stringify(data)
    }));

  }

  const shareAction = async (e:any) => {
    // console.log("shared!");
    let {name, value} = e.target;
    // console.log(value);
    if(value === -1){
      return;
    }
    if(id_posts != undefined){
      // console.log(value, id_posts);
      addPostToGroupAction(value, parseInt(id_posts));
    }
    setOpenShare(false);
  }

  const shareButton = async () =>{
    setOpenShare(true);
  }

  return (
      <Grid   
      container
      direction="column"
      alignItems="center"
      >
        <Card sx={{ maxWidth: 1000, margin: 4}}>
        <CardHeader
            avatar={
            <Avatar sx={ {bgcolor: colors[(Math.random()*100)%5]}} aria-label="recipe">
                {name?.at(0)}
            </Avatar>
            }
            title={title}
            subheader={created_at}
        />
        <CardContent>
            <Typography variant="body2" color="text.secondary">
            {post_content}
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {isOpenShare && 
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Group</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={-1}
            label="Group"
            onChange={shareAction}
          >
            {
              groups.filter((ele: any, idx: any, arr:any)=>{
                return ele.belongs;
              })
              .map( (item: any, key: any) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        }
          <ShareIcon aria-label="share" onClick={ shareButton } >

          </ShareIcon>
            <IconButton aria-label="upvote" onClick={ upVote }>
              <ThumbUpIcon />
            </IconButton>
            <IconButton aria-label="downvote" onClick={ downVote }>
              <ThumbDownIcon />
            </IconButton>
            <IconButton aria-label="vote value">
              {likeResult}
            </IconButton>
        </CardActions>
        </Card>
        <Accordion onChange={ () => { setShowComment(!isShowComment) }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Comments: </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid   
            container
            direction="column"
            alignItems="center"
            >
              <Accordion sx={{ width: 1000, margin: 1}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Add Comment: </Typography>
              </AccordionSummary>
              <AccordionDetails>
              <form>
                  <label>New Comment:</label><br></br>
                  <label>Content:</label>
                  <textarea value={contentForm} onChange={ e => handleChangeContent(e.target.value) }/>
                  {/* <input type="submit" value="Submit" /> */}
                  <input type="button" onClick={submit} value="Add Comment" />
              </form>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <div>
          { isShowComment && 
            comments.map( (item:any, key: any) => (
              <CommentComponent
              id_posts={id_posts}
              value={item.value}
              personalValue={ likeCommentResult.has(item.id)? likeCommentResult.get(item.id) : null }
              key={item.id}
              id_comments={item.id}
              name={item.name} 
              comment_content={item.comment_content}
              created_at={item.created_at} />
            ))
          }
          </div>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}

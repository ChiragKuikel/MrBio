import {
  AccessTime,
  CalendarToday
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography
} from "@mui/material";
import React from "react";
import { BlogPost } from "../../data/blogData";

interface BlogCardProps {
  post: BlogPost;
  onReadMore: (post: BlogPost) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          cursor: "pointer",
        },
        borderRadius: 2,
        overflow: "hidden",
      }}
      onClick={() => onReadMore(post)}
    >
      <CardMedia
        component="img"
        height="200"
        image={post.image}
        alt={post.title}
        sx={{
          objectFit: "cover",
          backgroundColor: "#f5f5f5",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Chip
            label={post.category}
            size="small"
            sx={{
              backgroundColor: "#77b831",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: "#666" }} />
            <Typography variant="caption" color="text.secondary">
              {post.readTime}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#77b831",
              fontSize: "0.875rem",
              mr: 1,
            }}
          >
            {post.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {post.author}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 12, color: "#666" }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.date)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                borderColor: "#77b831",
                color: "#77b831",
                "&:hover": {
                  backgroundColor: "#77b831",
                  color: "white",
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogCard;

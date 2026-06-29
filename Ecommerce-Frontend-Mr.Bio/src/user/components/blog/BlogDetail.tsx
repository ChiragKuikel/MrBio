import {
  AccessTime,
  ArrowBack,
  CalendarToday
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import { BlogPost } from '../../data/blogData';

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <Typography 
            key={index} 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: '#2e7d32',
              mt: 3,
              mb: 2
            }}
          >
            {paragraph.slice(2, -2)}
          </Typography>
        );
      }
      
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(item => item.startsWith('- '));
        return (
          <Box key={index} sx={{ my: 2 }}>
            {items.map((item, itemIndex) => (
              <Typography 
                key={itemIndex} 
                variant="body1" 
                sx={{ 
                  mb: 1,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ marginRight: '8px', color: '#77b831' }}>•</span>
                {item.slice(2)}
              </Typography>
            ))}
          </Box>
        );
      }
      
      return (
        <Typography 
          key={index} 
          variant="body1" 
          sx={{ 
            mb: 2,
            lineHeight: 1.8,
            color: '#333'
          }}
        >
          {paragraph}
        </Typography>
      );
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton 
          onClick={onBack}
          sx={{ 
            mb: 2,
            color: '#77b831',
            '&:hover': { backgroundColor: 'rgba(119, 184, 49, 0.1)' }
          }}
        >
          <ArrowBack />
        </IconButton>
        
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
          }}
        >
          <Box
            sx={{
              height: 300,
              backgroundImage: `url(${post.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#f5f5f5',
              position: 'relative'
            }}
          />
          
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Chip 
                label={post.category}
                size="medium"
                sx={{ 
                  backgroundColor: '#77b831',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ fontSize: 18, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.readTime}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.2,
                color: '#2e7d32'
              }}
            >
              {post.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: '#77b831',
                  fontSize: '1.2rem',
                  mr: 2
                }}
              >
                {post.author.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {post.author}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(post.date)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ mb: 4 }}>
              {formatContent(post.content)}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {post.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="medium"
                    variant="outlined"
                    sx={{ 
                      borderColor: '#77b831',
                      color: '#77b831',
                      '&:hover': {
                        backgroundColor: '#77b831',
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BlogDetail; 
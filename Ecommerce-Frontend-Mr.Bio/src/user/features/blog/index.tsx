import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { useMemo, useState } from 'react';
import PageHeader from "../../../shared/components/pageHeader";
import { Search } from "@mui/icons-material";
import BlogCard from "../../components/blog/BlogCard";
import BlogDetail from "../../components/blog/BlogDetail";
import { blogPosts, categories, type BlogPost } from "../../data/blogData";

const BlogPost = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return (
      <>
        <PageHeader
          title="Blog"
          breadcrumbs={[
            { label: "Home", path: "/" }, 
            { label: "Blog", path: "/home/our-blogs" },
            { label: selectedPost.title }
          ]}
        />
        <BlogDetail post={selectedPost} onBack={handleBack} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Our Blogs"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Our Blogs" }]}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 3,
              color: '#2e7d32',
              textAlign: 'center'
            }}
          >
            Discover Wellness & Organic Living
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4,
              textAlign: 'center',
              color: '#666',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Explore our collection of articles on organic living, healthy recipes, 
            sustainable practices, and wellness tips to enhance your lifestyle.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            justifyContent: 'center',
            mb: 4
          }}>
            <TextField
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Results Summary */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            </Typography>
            
            {(searchTerm || selectedCategory !== "All") && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {searchTerm && (
                  <Chip 
                    label={`Search: "${searchTerm}"`}
                    onDelete={() => setSearchTerm("")}
                    color="success"
                    variant="outlined"
                  />
                )}
                {selectedCategory !== "All" && (
                  <Chip 
                    label={`Category: ${selectedCategory}`}
                    onDelete={() => setSelectedCategory("All")}
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {filteredPosts.map((post) => (
              <Box key={post.id}>
                <BlogCard post={post} onReadMore={handleReadMore} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              minHeight: "40vh",
              p: 4,
              backgroundColor: "#f8faf8",
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              mb: 2,
              color: "#2e7d32"
            }}>
              No articles found
            </Typography>
            
            <Typography variant="body1" sx={{ 
              maxWidth: 500,
              mb: 3,
              color: "#666"
            }}>
              Try adjusting your search terms or category filter to find what you're looking for.
            </Typography>
            
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              sx={{ fontWeight: 600 }}
            >
              Clear Filters
            </Button>
          </Box>
        )}

      </Container>
    </>
  );
};

export default BlogPost;
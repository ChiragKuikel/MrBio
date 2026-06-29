/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Chip, Grid, Typography } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import PropTypes from "prop-types";
import { CustomButton } from "../../../../shared/components/button/CustomButton";

const FeatureImage = ({
  image,
  title,
  description,
  imageAlt = "Feature image",
  imageStyle = {},
  containerStyle = {},
  spacing = 3,
  layout = "image-left", // "image-left" or "image-right"
  buttonText,
  onButtonClick,
  highlights = [],
}: any) => {
  const ImageComponent = (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={imageAlt}
          sx={{
            maxWidth: "100%",
            height: "400px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            borderRadius: "12px",
            "&:hover": {
              transform: "scale(1.02)",
            },
            ...imageStyle,
          }}
        />
      </Box>
    </Grid>
  );

  const ContentComponent = (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box
        sx={{
          padding: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        {title && (
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: "700",
              mb: 2,
              color: "#2E7D32",
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        )}

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.6,
            color: "#666",
            mb: 3,
            fontSize: "1rem",
            fontWeight: "400",
          }}
        >
          {description}
        </Typography>

        {highlights.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {highlights.map((highlight: string, index: number) => (
                <Chip
                  key={index}
                  label={highlight}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "#4CAF50",
                    color: "#4CAF50",
                    fontWeight: "500",
                    fontSize: "0.85rem",
                    borderRadius: "16px",
                    borderWidth: "1px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#4CAF50",
                      color: "white",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {buttonText && (
          <CustomButton
            variant="outlined"
            onClick={onButtonClick}
            className={`w-full border border-green-600 text-green-600 rounded-full py-2 font-semibold text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer hover:bg-green-600 hover:text-white`}
          >
            {buttonText}
            <ShoppingCart size={18} />
          </CustomButton>
        )}
      </Box>
    </Grid>
  );

  return (
    <Box
      sx={{
        py: { xs: 4, md: 8 },
        px: { xs: 3, md: 6 },
        position: "relative",
        ...containerStyle,
      }}
    >
      <Grid
        container
        spacing={spacing}
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: { xs: "auto", md: "400px" },
          margin: "0 auto",
        }}
      >
        {layout === "image-left" ? (
          <>
            {ImageComponent}
            {ContentComponent}
          </>
        ) : (
          <>
            {ContentComponent}
            {ImageComponent}
          </>
        )}
      </Grid>
    </Box>
  );
};

FeatureImage.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  imageStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  spacing: PropTypes.number,
  layout: PropTypes.oneOf(["image-left", "image-right"]),
  buttonText: PropTypes.string,
  buttonProps: PropTypes.object,
  onButtonClick: PropTypes.func,
  badge: PropTypes.string,
  highlights: PropTypes.arrayOf(PropTypes.string),
};

export default FeatureImage;

/* eslint-disable @typescript-eslint/no-explicit-any */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  Paper,
  Slide,
  Stack,
  Typography
} from "@mui/material";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import FormProvider from "../../../shared/components/form/FormProvider";
import RHFSelect from "../../../shared/components/form/RHFSelect";
import { useModal } from "../../../shared/context/ModalContext";
import usePatchOrderStatusByOrderId from '../../../shared/hooks/order/patch/usePatchOrderStatusByOrderId';
import FormDetails from "../viewDetails";

// Order Status Enum
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

const UpdateOrderDetails = ({ rowData }: any) => {
  // const [data, setData] = useState();
  const { closeModal } = useModal();
  const {mutate:patchOrderDetails} = usePatchOrderStatusByOrderId(closeModal)
  
  // useEffect(() => {
  //   if (rowData) {
  //     setData(rowData);
  //   }
  // }, [rowData]);
    
  const methods = useForm({
    defaultValues: {
      status: rowData?.status || "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });
  
  const {
    handleSubmit,
  } = methods;
  
  const onSubmit = (formData:any) => {
    const payload ={
      status: formData?.status
    }
    patchOrderDetails({id:rowData?.id, updates:payload})
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper function to get status color with green theme
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Enhanced status options
  const statusOptions = [
    { id: "pending", name: "Pending" },
    { id: "processing", name: "Processing" },
    { id: "shipped", name: "Shipped" },
    { id: "delivered", name: "Delivered" },
    { id: "cancelled", name: "Cancelled" }
  ];

  // Section Header Component
  const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle?: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Avatar sx={{ 
        bgcolor: 'success.main', 
        width: 36, 
        height: 36,
        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
      }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" color="success.main">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );

  // Enhanced Info Card Component
  const InfoCard = ({ children, elevation = 2 }: { children: React.ReactNode, elevation?: number }) => (
    <Card 
      elevation={elevation}
      sx={{ 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          transform: 'translateY(-1px)'
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ p: 0, maxHeight: '80vh', overflow: 'auto' }}>
        <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100%' }}>
          <Stack spacing={3}>
            {/* Header with Order Status */}
            <Fade in timeout={600}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: -50, 
                  right: -50, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.1)' 
                }} />
                <Grid container spacing={2} alignItems="center">
                  <Grid size={8}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Order 
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Order Date: {rowData?.created?.at ? formatDate(rowData.created.at) : "-"}
                    </Typography>
                  </Grid>
                  <Grid size={4} sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={rowData?.status || "Unknown"} 
                      color={getStatusColor(rowData?.status)}
                      size="medium"
                      sx={{ 
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        height: 32,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                      Total: Rs. {rowData?.totalAmount || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>

            {/* Order Information Section */}
            <Slide in direction="up" timeout={800}>
              <div>
                <SectionHeader 
                  icon={<InfoIcon />} 
                  title="Order Information"
                  subtitle="Basic order details and summary"
                />
                <InfoCard>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <FormDetails
                        label={"Total Amount"}
                        value={rowData?.totalAmount ? `Rs. ${rowData.totalAmount}` : "-"}
                        key={"total_amount"}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FormDetails
                        label={"Shipping Cost"}
                        value={rowData?.shippingCost ? `Rs. ${rowData.shippingCost}` : "-"}
                        key={"shipping_cost"}
                      />
                    </Grid>
                    {/* <Grid size={4}>
                      <FormDetails
                        label={"User ID"}
                        value={rowData?.userId || "-"}
                        key={"user_id"}
                      />
                    </Grid> */}
                  </Grid>
                </InfoCard>
              </div>
            </Slide>

            {/* Customer Information Section */}
            <Slide in direction="up" timeout={1000}>
              <div>
                <SectionHeader 
                  icon={<PersonIcon />} 
                  title="Customer Information"
                  subtitle="Contact and shipping details"
                />
                <InfoCard>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <FormDetails
                        label={"Customer Name"}
                        value={rowData?.contact?.name || "-"}
                        key={"customer_name"}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FormDetails
                        label={"Email"}
                        value={rowData?.contact?.email || "-"}
                        key={"email"}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FormDetails
                        label={"Phone"}
                        value={rowData?.contact?.phone || "-"}
                        key={"phone"}
                      />
                    </Grid>
                    <Grid size={6}>
                      <FormDetails
                        label={"Contact Address"}
                        value={rowData?.contact?.address || "-"}
                        key={"contact_address"}
                      />
                    </Grid>
                    <Grid size={6}>
                      <FormDetails
                        label={"Shipping Address"}
                        value={rowData?.shippingAddress || "-"}
                        key={"shipping_address"}
                      />
                    </Grid>
                  </Grid>
                </InfoCard>
              </div>
            </Slide>

            {/* Payment Information Section */}
            <Slide in direction="up" timeout={1200}>
              <div>
                <SectionHeader 
                  icon={<PaymentIcon />} 
                  title="Payment Information"
                  subtitle="Transaction and payment details"
                />
                <InfoCard>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <FormDetails
                        label={"Payment Method"}
                        value={rowData?.payment?.method || "-"}
                        key={"payment_method"}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FormDetails
                        label={"Payment Amount"}
                        value={rowData?.payment?.amount ? `Rs. ${rowData.payment.amount}` : "-"}
                        key={"payment_amount"}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FormDetails
                        label={"Payment Date"}
                        value={rowData?.payment?.date ? formatDate(rowData.payment.date) : "-"}
                        key={"payment_date"}
                      />
                    </Grid>
                  </Grid>
                </InfoCard>
              </div>
            </Slide>

            {/* Order Items Section */}
            <Slide in direction="up" timeout={1400}>
              <div>
                <SectionHeader 
                  icon={<InventoryIcon />} 
                  title="Order Items"
                  subtitle={`${rowData?.orderItems?.length || 0} items in this order`}
                />
                <InfoCard elevation={3}>
                  <Stack spacing={2}>
                    {rowData?.orderItems?.map((item: any, index: number) => (
                      <Accordion
                        key={index}
                        sx={{ 
                          boxShadow: 'none',
                          border: '1px solid',
                          borderColor: 'success.light',
                          borderRadius: 2,
                          '&:before': { display: 'none' },
                          '&.Mui-expanded': {
                            margin: 0,
                          }
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{
                            background: 'linear-gradient(90deg, #E8F5E8 0%, #F1F8E9 100%)',
                            borderRadius: '8px 8px 0 0',
                            minHeight: 56,
                            '&.Mui-expanded': {
                              minHeight: 56,
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Avatar sx={{ 
                              bgcolor: 'success.main', 
                              width: 32, 
                              height: 32,
                              fontSize: '0.875rem'
                            }}>
                              {index + 1}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" fontWeight="bold" color="success.dark">
                                {item?.product?.name || "Unknown Product"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Qty: {item?.quantity || 0} | Price: Rs. {item?.product?.finalPrice || 0}
                              </Typography>
                            </Box>
                            <Chip 
                              label={`Rs. ${item?.product?.finalPrice && item?.quantity ? item.product.finalPrice * item.quantity : 0}`}
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Grid container spacing={2}>
                            {/* <Grid size={3}>
                              <FormDetails
                                label={"Product ID"}
                                value={item?.product?.id || "-"}
                                key={`product_id_${index}`}
                              />
                            </Grid> */}
                            <Grid size={3}>
                              <FormDetails
                                label={"Brand"}
                                value={item?.product?.brand || "-"}
                                key={`brand_${index}`}
                              />
                            </Grid>
                            <Grid size={3}>
                              <FormDetails
                                label={"Unit Price"}
                                value={item?.product?.price ? `Rs. ${item.product.price}` : "-"}
                                key={`unit_price_${index}`}
                              />
                            </Grid>
                            <Grid size={3}>
                              <FormDetails
                                label={"Final Price"}
                                value={item?.product?.finalPrice ? `Rs. ${item.product.finalPrice}` : "-"}
                                key={`final_price_${index}`}
                              />
                            </Grid>
                            <Grid size={3}>
                              <FormDetails
                                label={"Discount"}
                                value={item?.product?.discount ? `Rs. ${item.product.discount}` : "-"}
                                key={`discount_${index}`}
                              />
                            </Grid>
                            <Grid size={3}>
                              <FormDetails
                                label={"Stock Available"}
                                value={item?.product?.stock?.toString() || "-"}
                                key={`stock_${index}`}
                              />
                            </Grid>
                            <Grid size={3}>
                              <FormDetails
                                label={"Rating"}
                                value={item?.product?.rating ? `${item.product.rating}/5` : "No rating"}
                                key={`rating_${index}`}
                              />
                            </Grid>
                            <Grid size={3}>
                              <Box sx={{ 
                                p: 1.5, 
                                bgcolor: 'success.light', 
                                borderRadius: 1,
                                textAlign: 'center'
                              }}>
                                <Typography variant="caption" color="success.dark" fontWeight="bold">
                                  Item Total
                                </Typography>
                                <Typography variant="subtitle2" color="success.dark" fontWeight="bold">
                                  {item?.product?.finalPrice && item?.quantity
                                    ? `Rs. ${item.product.finalPrice * item.quantity}`
                                    : "-"}
                                </Typography>
                              </Box>
                            </Grid>

                            {item?.product?.tags && item.product.tags.length > 0 && (
                              <Grid size={12}>
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>
                                    Tags:
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {item.product.tags.map((tag: string, tagIndex: number) => (
                                      <Chip
                                        key={tagIndex}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                        color="success"
                                        sx={{ height: 24, fontSize: '0.75rem' }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              </Grid>
                            )}

                            <Grid size={12}>
                              <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
                                  Description:
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item?.product?.description || "-"}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </InfoCard>
              </div>
            </Slide>

            {/* Status Update Section */}
            <Slide in direction="up" timeout={1600}>
              <div>
                <SectionHeader 
                  icon={<LocalShippingIcon />} 
                  title="Update Order Status"
                  subtitle="Change the current status of this order"
                />
                <InfoCard>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <RHFSelect 
                        name="status" 
                        customLabel="Update Status" 
                        options={statusOptions}
                      />
                    </Grid>
                  </Grid>
                </InfoCard>
              </div>
            </Slide>
          </Stack>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2.5, 
        bgcolor: 'grey.50', 
        borderTop: '1px solid', 
        borderColor: 'divider',
        gap: 2
      }}>
        <Button
          color="error"
          variant="outlined"
          size="medium"
          onClick={closeModal}
          sx={{ 
            minWidth: 100,
            height: 40,
            borderRadius: 2,
            fontWeight: 'bold'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="medium"
          type="submit"
          startIcon={<SaveIcon />}
          sx={{
            minWidth: 120,
            height: 40,
            borderRadius: 2,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 15px rgba(46, 125, 50, 0.4)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </FormProvider>
  );
};

export default UpdateOrderDetails;
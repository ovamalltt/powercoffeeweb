-- Function to add loyalty points to a customer
CREATE OR REPLACE FUNCTION add_loyalty_points(p_customer_id INTEGER, p_points INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE pelanggan 
  SET poin_loyalitas = COALESCE(poin_loyalitas, 0) + p_points
  WHERE id_pelanggan = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_loyalty_points(INTEGER, INTEGER) TO authenticated;

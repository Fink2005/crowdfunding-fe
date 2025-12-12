// Paste this in browser console on https://fundhive.pro.vn
// to check image URLs in API response

fetch('/api/campaigns/metadata?page=1&limit=6')
  .then((res) => res.json())
  .then((data) => {
    console.log('=== Campaign Data ===')
    console.log('Full response:', data)

    if (data.campaigns && data.campaigns.length > 0) {
      const firstCampaign = data.campaigns[0]
      console.log('\n=== First Campaign ===')
      console.log('Title:', firstCampaign.title || firstCampaign.name)
      console.log(
        'Image URL:',
        firstCampaign.imageUrl ||
          firstCampaign.image ||
          firstCampaign.coverImage
      )
      console.log('Full object:', firstCampaign)

      // Check all image fields
      const imageFields = Object.keys(firstCampaign).filter(
        (key) =>
          key.toLowerCase().includes('image') ||
          key.toLowerCase().includes('photo') ||
          key.toLowerCase().includes('picture') ||
          key.toLowerCase().includes('cover')
      )

      console.log('\n=== All image-related fields ===')
      imageFields.forEach((field) => {
        console.log(`${field}:`, firstCampaign[field])
      })
    }
  })
  .catch((err) => console.error('Error:', err))

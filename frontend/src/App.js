import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from '@mui/material';

function PerplexitySearchForm() {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // ここで検索クエリを処理します（例：APIリクエストの送信など）
    console.log('検索クエリ:', query);
  };

  return (
    <Container maxWidth="">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          今日の予定は？
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            sx={{ width: '100%' }}
            id="query"
            multiline
            label="今日は朝卵を食べて、塩釜口に行って..."
            name="query"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            おばあを呼ぶ
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default PerplexitySearchForm;

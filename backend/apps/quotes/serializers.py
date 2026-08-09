from rest_framework import serializers
from apps.quotes.models import QuoteRequest, QuoteProposal

class QuoteProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteProposal
        fields = '__all__'

class QuoteRequestSerializer(serializers.ModelSerializer):
    proposal = QuoteProposalSerializer(read_only=True)

    class Meta:
        model = QuoteRequest
        fields = '__all__'
        read_only_fields = ('quote_number', 'status')
